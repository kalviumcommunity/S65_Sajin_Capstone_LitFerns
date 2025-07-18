const express = require('express');
const router = express.Router();
const {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware'); 

// Public routes 
router.route('/').get(getBooks);
router.route('/:id').get(getBookById);

// Protected routes (for only logged-in users can modify books)
router.route('/').post(protect, createBook); 
router.route('/:id').put(protect, updateBook).delete(protect, deleteBook);

module.exports = router;