const asyncHandler = require('express-async-handler');
const Swap = require('../models/Swap');
const Book = require('../models/Book');
const Notification = require('../models/Notification');

// @desc    Create a new swap request
// @route   POST /api/swaps
// @access  Private
const createSwapRequest = asyncHandler(async (req, res) => {
    const { requestedBookIds, offeredBookIds, message } = req.body;

    if (!requestedBookIds || !Array.isArray(requestedBookIds) || requestedBookIds.length === 0) {
        res.status(400);
        throw new Error('At least one requested book ID is required');
    }

    const requestedBooks = await Book.find({ _id: { $in: requestedBookIds } }).populate('owner', 'name');
    if (requestedBooks.length !== requestedBookIds.length) {
        res.status(404);
        throw new Error('One or more requested books not found');
    }

    // Check if all requested books belong to the same owner
    const ownerId = requestedBooks[0].owner._id.toString();
    const sameOwner = requestedBooks.every((book) => book.owner._id.toString() === ownerId);
    if (!sameOwner) {
        res.status(400);
        throw new Error('All requested books must belong to the same owner');
    }

    // Check availability and ownership
    requestedBooks.forEach((book) => {
        if (!book.isAvailable) {
            res.status(400);
            throw new Error(`Book "${book.title}" is not available for swap`);
        }
        if (book.owner._id.toString() === req.user._id.toString()) {
            res.status(400);
            throw new Error('You cannot request a swap for your own book');
        }
    });

    // Check for existing pending request for any of these books
    const existingRequest = await Swap.findOne({
        requester: req.user._id,
        requestedBooks: { $in: requestedBookIds },
        status: { $in: ['Pending', 'Accepted', 'Shipped', 'In Transit'] },
    });

    if (existingRequest) {
        res.status(400);
        throw new Error('You already have an active swap request for one of these books');
    }

    // Validate offered books if provided
    if (offeredBookIds && Array.isArray(offeredBookIds)) {
        const offeredBooks = await Book.find({ _id: { $in: offeredBookIds } });
        if (offeredBooks.length !== offeredBookIds.length) {
            res.status(404);
            throw new Error('One or more offered books not found');
        }
        offeredBooks.forEach((book) => {
            if (book.owner.toString() !== req.user._id.toString()) {
                res.status(403);
                throw new Error('You can only offer books you own');
            }
        });
    }

    const swap = await Swap.create({
        requester: req.user._id,
        owner: ownerId,
        requestedBooks: requestedBookIds,
        offeredBooks: offeredBookIds || [],
        message: message?.trim() || '',
        status: 'Pending',
        trackingProgress: 0,
    });

    // Create notification for the owner
    await Notification.create({
        user: ownerId,
        type: 'SwapRequest',
        content: `${req.user.name} requested a swap for ${requestedBooks[0].title}${requestedBooks.length > 1 ? ` and ${requestedBooks.length - 1} more` : ''}.`,
        relatedId: swap._id,
        onModel: 'Swap',
    });

    const populated = await Swap.findById(swap._id)
        .populate('requester', 'name email')
        .populate('owner', 'name email')
        .populate('requestedBooks', 'title author image genre condition')
        .populate('offeredBooks', 'title author image genre condition');

    res.status(201).json(populated);
});

// @desc    Get all swaps for current user (as requester or owner)
// @route   GET /api/swaps
// @access  Private
const getMySwaps = asyncHandler(async (req, res) => {
    const { status, role } = req.query;
    const userId = req.user._id;

    let filter = {
        $or: [{ requester: userId }, { owner: userId }],
    };

    if (status) {
        filter.status = status;
    }

    if (role === 'incoming') {
        filter = { owner: userId };
        if (status) filter.status = status;
        else filter.status = 'Pending';
    } else if (role === 'outgoing') {
        filter = { requester: userId };
        if (status) filter.status = status;
    }

    const swaps = await Swap.find(filter)
        .populate('requester', 'name email')
        .populate('owner', 'name email')
        .populate('requestedBooks', 'title author image genre condition')
        .populate('offeredBooks', 'title author image genre condition')
        .sort({ updatedAt: -1 });

    res.json(swaps);
});

// @desc    Update swap status (accept, decline, mark shipped, complete, cancel)
// @route   PUT /api/swaps/:id
// @access  Private
const updateSwapStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
        res.status(404);
        throw new Error('Swap not found');
    }

    const userId = req.user._id.toString();
    const isOwner = swap.owner.toString() === userId;
    const isRequester = swap.requester.toString() === userId;

    if (!isOwner && !isRequester) {
        res.status(403);
        throw new Error('Not authorized to update this swap');
    }

    // Define valid transitions
    const validTransitions = {
        // Owner can accept or decline pending requests
        Pending: isOwner ? ['Accepted', 'Declined'] : ['Cancelled'],
        // After acceptance, either party can mark shipped
        Accepted: ['Shipped', 'Cancelled'],
        // After shipping, transition to in transit
        Shipped: ['In Transit', 'Cancelled'],
        // In transit can be completed
        'In Transit': ['Completed', 'Cancelled'],
    };

    const allowed = validTransitions[swap.status] || [];
    if (!allowed.includes(status)) {
        res.status(400);
        throw new Error(`Cannot change status from "${swap.status}" to "${status}"`);
    }

    // Update tracking progress based on status
    const progressMap = {
        Pending: 0,
        Accepted: 25,
        Shipped: 50,
        'In Transit': 75,
        Completed: 100,
        Declined: 0,
        Cancelled: 0,
    };

    swap.status = status;
    swap.trackingProgress = progressMap[status] ?? swap.trackingProgress;

    // If completed, mark the books as unavailable and update user stats
    if (status === 'Completed') {
        await Book.updateMany({ _id: { $in: swap.requestedBooks } }, { isAvailable: false });
        if (swap.offeredBooks && swap.offeredBooks.length > 0) {
            await Book.updateMany({ _id: { $in: swap.offeredBooks } }, { isAvailable: false });
        }
        // Update successful swap counts for both users
        const User = require('../models/User');
        await User.findByIdAndUpdate(swap.requester, { $inc: { successfulSwaps: 1 } });
        await User.findByIdAndUpdate(swap.owner, { $inc: { successfulSwaps: 1 } });
    }

    // If cancelled or declined, ensure no side effects
    if (status === 'Cancelled' || status === 'Declined') {
        swap.trackingProgress = 0;
    }

    await swap.save();

    // Create notification for the other party
    const notificationUser = isOwner ? swap.requester : swap.owner;
    let notificationType = 'SwapRequest';
    let content = `Swap status updated to ${status}`;

    if (status === 'Accepted') notificationType = 'SwapAccepted';
    if (status === 'Declined') notificationType = 'SwapDeclined';
    if (status === 'Shipped') notificationType = 'SwapShipped';
    if (status === 'Completed') notificationType = 'SwapCompleted';

    if (status === 'Accepted') content = `${req.user.name} accepted your swap request!`;
    if (status === 'Declined') content = `${req.user.name} declined your swap request.`;
    if (status === 'Shipped') content = `${req.user.name} marked the books as shipped.`;
    if (status === 'Completed') content = `Your swap with ${req.user.name} is complete!`;
    if (status === 'Cancelled') content = `${req.user.name} cancelled the swap request.`;

    await Notification.create({
        user: notificationUser,
        type: notificationType,
        content,
        relatedId: swap._id,
        onModel: 'Swap',
    });

    const updated = await Swap.findById(swap._id)
        .populate('requester', 'name email')
        .populate('owner', 'name email')
        .populate('requestedBooks', 'title author image genre condition')
        .populate('offeredBooks', 'title author image genre condition');

    res.json(updated);
});

// @desc    Get swap stats for the platform
// @route   GET /api/swaps/stats
// @access  Public
const getSwapStats = asyncHandler(async (req, res) => {
    const [totalBooks, totalUsers, completedSwaps] = await Promise.all([
        Book.countDocuments(),
        require('../models/User').countDocuments(),
        Swap.countDocuments({ status: 'Completed' }),
    ]);

    res.json({
        totalBooks,
        totalUsers,
        completedSwaps,
    });
});

// @desc    Rate a completed swap
// @route   POST /api/swaps/:id/rate
// @access  Private
const rateSwap = asyncHandler(async (req, res) => {
    const parsedRating = Number(req.body?.rating);
    if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        res.status(400);
        throw new Error('Rating must be a number between 1 and 5');
    }

    const swap = await Swap.findById(req.params.id);

    if (!swap) {
        res.status(404);
        throw new Error('Swap not found');
    }

    if (swap.status !== 'Completed') {
        res.status(400);
        throw new Error('Can only rate completed swaps');
    }

    const userId = req.user._id.toString();
    const isRequester = swap.requester.toString() === userId;
    const isOwner = swap.owner.toString() === userId;

    if (!isRequester && !isOwner) {
        res.status(403);
        throw new Error('Not authorized to rate this swap');
    }

    let userToRate;
    if (isRequester) {
        if (swap.ownerRating) {
            res.status(400);
            throw new Error('You have already rated this swap');
        }
        swap.ownerRating = parsedRating;
        userToRate = await require('../models/User').findById(swap.owner);
    } else { // isOwner
        if (swap.requesterRating) {
            res.status(400);
            throw new Error('You have already rated this swap');
        }
        swap.requesterRating = parsedRating;
        userToRate = await require('../models/User').findById(swap.requester);
    }

    if (!userToRate) {
        res.status(404);
        throw new Error('User to rate was not found');
    }

    // Recalculate average rating
    const allRatedSwaps = await Swap.find({
        status: 'Completed',
        $and: [
            { $or: [{ owner: userToRate._id }, { requester: userToRate._id }] },
            { $or: [{ ownerRating: { $ne: null } }, { requesterRating: { $ne: null } }] },
        ],
    });

    const ratingAccumulator = allRatedSwaps.reduce((acc, currentSwap) => {
        if (currentSwap.owner.toString() === userToRate._id.toString() && currentSwap.requesterRating) {
            acc.total += currentSwap.requesterRating;
            acc.count += 1;
        }
        if (currentSwap.requester.toString() === userToRate._id.toString() && currentSwap.ownerRating) {
            acc.total += currentSwap.ownerRating;
            acc.count += 1;
        }
        return acc;
    }, { total: 0, count: 0 });

    userToRate.averageRating = ratingAccumulator.count > 0
        ? Number((ratingAccumulator.total / ratingAccumulator.count).toFixed(1))
        : parsedRating;

    await userToRate.save();
    await swap.save();

    res.status(200).json({ message: 'Swap rated successfully' });
});

// @desc    Delete/cancel a swap request
// @route   DELETE /api/swaps/:id
// @access  Private
const deleteSwap = asyncHandler(async (req, res) => {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
        res.status(404);
        throw new Error('Swap not found');
    }

    const userId = req.user._id.toString();
    if (swap.requester.toString() !== userId && swap.owner.toString() !== userId) {
        res.status(403);
        throw new Error('Not authorized to delete this swap');
    }

    await swap.deleteOne();
    res.json({ message: 'Swap request removed' });
});

module.exports = {
    createSwapRequest,
    getMySwaps,
    updateSwapStatus,
    getSwapStats,
    rateSwap,
    deleteSwap,
};
