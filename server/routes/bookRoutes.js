const express = require('express');
const router = express.Router();
const {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getMyBooks, 
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

// --- Public Routes ---
router.route('/').get(getBooks);

// --- Protected Routes ---
router.route('/mybooks').get(protect, getMyBooks);

// --- Routes with an ID parameter ---
router.route('/:id').get(getBookById).put(protect, updateBook).delete(protect, deleteBook);

// --- The POST route can stay on the base path and is protected ---
router.route('/').post(protect, createBook);

module.exports = router;