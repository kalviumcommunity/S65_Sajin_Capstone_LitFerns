let mockBooks = require('../utils/mockData');

const getBooks = (req, res) => {
    res.status(200).json(mockBooks);
};

// Get single book by ID
// GET /api/books/:id
const getBookById = (req, res) => {
    const book = mockBooks.find((b) => b.id === req.params.id);

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
};

// Create a new book
// POST /api/books
const createBook = (req, res) => {
    const { title, author, genre, condition, ownerId } = req.body;

    if (!title || !author) {
        return res.status(400).json({ message: 'Please include a title and author.' });
    }

    const newBook = {
        id: String(mockBooks.length + 1), 
        title,
        author,
        genre: genre || 'Not specified',
        condition: condition || 'Good',
        ownerId: ownerId || 'mockUser',
        isAvailable: true,
    };

    mockBooks.push(newBook);
    res.status(201).json(newBook);
};

// Update an existing book
// PUT /api/books/:id

const updateBook = (req, res) => {
    const { id } = req.params; 
    const { title, author, genre, condition, isAvailable } = req.body; 

    const bookIndex = mockBooks.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Book not found' });
    }

    const updatedBook = {
        ...mockBooks[bookIndex], 
        title: title || mockBooks[bookIndex].title, 
        author: author || mockBooks[bookIndex].author, 
        genre: genre || mockBooks[bookIndex].genre,
        condition: condition || mockBooks[bookIndex].condition,
        isAvailable: isAvailable !== undefined ? isAvailable : mockBooks[bookIndex].isAvailable,
    };

    mockBooks[bookIndex] = updatedBook;
    res.status(200).json(updatedBook);
};


const deleteBook = (req, res) => {
    const { id } = req.params;

    const bookExists = mockBooks.find((book) => book.id === id);

    if (!bookExists) {
        return res.status(404).json({ message: 'Book not found' });
    }

    mockBooks = mockBooks.filter((book) => book.id !== id);
    res.status(200).json({ message: 'Book removed successfully' });
};

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook, 
};