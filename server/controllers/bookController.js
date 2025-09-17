const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');


// Get all books
// GET /api/books
const getBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({}).populate('owner', 'name email');
    res.status(200).json(books);
});

// Get single book by ID
// GET /api/books/:id
const getBookById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate('owner', 'name email');

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
    const { title, author, genre, condition, image } = req.body;
    // ADD: Basic validation
    if (!title || !author || !genre || !condition || !image) {
        res.status(400);
        throw new Error('Please fill out all fields');
    }
    const book = await Book.create({
        owner: req.user._id, 
        title,
        author,
        genre,
        condition,
        image,
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

// Get logged-in user's books
// GET /api/books/mybooks

const getMyBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({ owner: req.user._id }).populate('owner', 'name email'); 
    res.status(200).json(books);
});


module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getMyBooks, 
};