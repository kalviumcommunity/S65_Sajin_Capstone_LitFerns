const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Get all reviews for a book
// @route   GET /api/reviews/book/:bookId
// @access  Public
const getBookReviews = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const { sort = 'newest', page = 1, limit = 10 } = req.query;

    const pageNum = Number(page) || 1;
    const pageSize = Math.min(Number(limit) || 10, 50);

    const sortMap = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        helpful: { helpful: -1 },
        rating_high: { rating: -1 },
        rating_low: { rating: 1 },
    };

    const sortOption = sortMap[sort] || sortMap.newest;

    const total = await Review.countDocuments({ book: bookId });
    const reviews = await Review.find({ book: bookId })
        .populate('user', 'name averageRating')
        .sort(sortOption)
        .skip(pageSize * (pageNum - 1))
        .limit(pageSize);

    res.json({
        reviews,
        page: pageNum,
        pages: Math.ceil(total / pageSize),
        total,
    });
});

// @desc    Get user's reviews
// @route   GET /api/reviews/user
// @access  Private
const getUserReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ user: req.user._id })
        .populate('book', 'title author image')
        .sort({ createdAt: -1 });

    res.json(reviews);
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
    const { bookId, rating, title, comment } = req.body;

    if (!bookId || !rating || !title || !comment) {
        res.status(400);
        throw new Error('All fields are required');
    }

    const parsedRating = Number(rating);
    if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        res.status(400);
        throw new Error('Rating must be between 1 and 5');
    }

    if (title.trim().length === 0 || title.length > 150) {
        res.status(400);
        throw new Error('Title must be 1-150 characters');
    }

    if (comment.trim().length < 10 || comment.length > 2000) {
        res.status(400);
        throw new Error('Comment must be 10-2000 characters');
    }

    const book = await Book.findById(bookId);
    if (!book) {
        res.status(404);
        throw new Error('Book not found');
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ book: bookId, user: req.user._id });
    if (existingReview) {
        res.status(400);
        throw new Error('You have already reviewed this book');
    }

    const review = await Review.create({
        book: bookId,
        user: req.user._id,
        rating: parsedRating,
        title: title.trim(),
        comment: comment.trim(),
    });

    const populated = await review.populate('user', 'name averageRating');

    res.status(201).json(populated);
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
    const { rating, title, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    if (review.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this review');
    }

    if (rating !== undefined) {
        const parsedRating = Number(rating);
        if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            res.status(400);
            throw new Error('Rating must be between 1 and 5');
        }
        review.rating = parsedRating;
    }

    if (title !== undefined) {
        if (title.trim().length === 0 || title.length > 150) {
            res.status(400);
            throw new Error('Title must be 1-150 characters');
        }
        review.title = title.trim();
    }

    if (comment !== undefined) {
        if (comment.trim().length < 10 || comment.length > 2000) {
            res.status(400);
            throw new Error('Comment must be 10-2000 characters');
        }
        review.comment = comment.trim();
    }

    const updated = await review.save();
    res.json(updated);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    if (review.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this review');
    }

    await review.deleteOne();
    res.json({ message: 'Review removed' });
});

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
const markHelpful = asyncHandler(async (req, res) => {
    const review = await Review.findByIdAndUpdate(
        req.params.id,
        { $inc: { helpful: 1 } },
        { new: true }
    );

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    res.json(review);
});

module.exports = {
    getBookReviews,
    getUserReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
};
