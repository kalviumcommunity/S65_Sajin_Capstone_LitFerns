const asyncHandler = require('express-async-handler');
const Swap = require('../models/Swap');
const Book = require('../models/Book');

// @desc    Create a new swap request
// @route   POST /api/swaps
// @access  Private
const createSwapRequest = asyncHandler(async (req, res) => {
    const { requestedBookId, offeredBookId, message } = req.body;

    if (!requestedBookId) {
        res.status(400);
        throw new Error('Requested book ID is required');
    }

    const requestedBook = await Book.findById(requestedBookId).populate('owner', 'name');
    if (!requestedBook) {
        res.status(404);
        throw new Error('Requested book not found');
    }

    if (!requestedBook.isAvailable) {
        res.status(400);
        throw new Error('This book is not available for swap');
    }

    // Can't swap your own book
    if (requestedBook.owner._id.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('You cannot request a swap for your own book');
    }

    // Check for existing pending request
    const existingRequest = await Swap.findOne({
        requester: req.user._id,
        requestedBook: requestedBookId,
        status: { $in: ['Pending', 'Accepted', 'Shipped', 'In Transit'] },
    });

    if (existingRequest) {
        res.status(400);
        throw new Error('You already have an active swap request for this book');
    }

    // Validate offered book if provided
    if (offeredBookId) {
        const offeredBook = await Book.findById(offeredBookId);
        if (!offeredBook) {
            res.status(404);
            throw new Error('Offered book not found');
        }
        if (offeredBook.owner.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('You can only offer books you own');
        }
    }

    const swap = await Swap.create({
        requester: req.user._id,
        owner: requestedBook.owner._id,
        requestedBook: requestedBookId,
        offeredBook: offeredBookId || null,
        message: message?.trim() || '',
        status: 'Pending',
        trackingProgress: 0,
    });

    const populated = await Swap.findById(swap._id)
        .populate('requester', 'name email')
        .populate('owner', 'name email')
        .populate('requestedBook', 'title author image genre condition')
        .populate('offeredBook', 'title author image genre condition');

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
        .populate('requestedBook', 'title author image genre condition')
        .populate('offeredBook', 'title author image genre condition')
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

    // If completed, mark the book as unavailable
    if (status === 'Completed') {
        await Book.findByIdAndUpdate(swap.requestedBook, { isAvailable: false });
        if (swap.offeredBook) {
            await Book.findByIdAndUpdate(swap.offeredBook, { isAvailable: false });
        }
    }

    // If cancelled or declined, ensure no side effects
    if (status === 'Cancelled' || status === 'Declined') {
        swap.trackingProgress = 0;
    }

    await swap.save();

    const updated = await Swap.findById(swap._id)
        .populate('requester', 'name email')
        .populate('owner', 'name email')
        .populate('requestedBook', 'title author image genre condition')
        .populate('offeredBook', 'title author image genre condition');

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
    deleteSwap,
};
