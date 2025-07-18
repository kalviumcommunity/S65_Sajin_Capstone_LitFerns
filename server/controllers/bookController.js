const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');


// Get all books
// GET /api/books
const getBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({});
    res.status(200).json(books);
});

// Get single book by ID
// GET /api/books/:id
const getBookById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        res.json(book);
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

// Create a new book
// POST /api/books
const createBook = asyncHandler(async (req, res) => {
    const { title, author, genre, condition } = req.body;

    const book = await Book.create({
        owner: req.user._id, 
        title,
        author,
        genre,
        condition,
    });

    res.status(201).json(book);
});

// Update an existing book
// PUT /api/books/:id
const updateBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        res.status(404);
        throw new Error('Book not found');
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedBook);
});


// Delete a book
// DELETE /api/books/:id
const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        res.status(404);
        throw new Error('Book not found');
    }

    await book.deleteOne();

    res.status(200).json({ message: 'Book removed successfully' });
});

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
};