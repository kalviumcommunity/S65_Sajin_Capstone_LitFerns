const mockBooks = require('../utils/mockData');

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

module.exports = { getBooks, getBookById, createBook };