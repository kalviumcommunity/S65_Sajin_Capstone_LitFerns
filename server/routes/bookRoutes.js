const express = require('express');
const router = express.Router();
const {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getMyBooks,
    getRecommendations,
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

// Group routes for the base path '/'
router.route('/')
    .get(getBooks)
    .post(protect, createBook);

// Route for a logged-in user to get their own books (must be before /:id route to avoid collision)
router.get('/mybooks', protect, getMyBooks);

// Route for recommendations
router.get('/recommendations', protect, getRecommendations);

// Group routes for a specific book ID '/:id'
router.route('/:id')
    .get(getBookById)
    .put(protect, updateBook)
    .delete(protect, deleteBook);

module.exports = router;