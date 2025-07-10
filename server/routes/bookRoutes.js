const express = require('express');
const {
    getBooks,
    getBookById,
    createBook,
    updateBook, 
} = require('../controllers/bookController');

const router = express.Router();

// Routes for /api/books
router.route('/')
    .get(getBooks)
    .post(createBook);

// Routes for /api/books/:id
router.route('/:id')
    .get(getBookById)
    .put(updateBook);

module.exports = router;