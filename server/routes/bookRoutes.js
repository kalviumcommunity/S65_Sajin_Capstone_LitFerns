const express = require('express');
const { getBooks, getBookById, createBook } = require('../controllers/bookController'); 

const router = express.Router();

// GET routes 
router.get('/', getBooks);
router.get('/:id', getBookById);

// POST routes
router.post('/', createBook); 

module.exports = router;