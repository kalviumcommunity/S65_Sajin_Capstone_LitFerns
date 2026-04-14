const express = require('express');
const router = express.Router();
const {
    getBookReviews,
    getUserReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Get reviews for a book (public)
router.get('/book/:bookId', getBookReviews);

// Get current user's reviews
router.get('/user', protect, getUserReviews);

// Create, update, delete reviews (protected)
router.route('/').post(protect, createReview);
router.route('/:id')
    .put(protect, updateReview)
    .delete(protect, deleteReview);

// Mark review as helpful
router.put('/:id/helpful', protect, markHelpful);

module.exports = router;
