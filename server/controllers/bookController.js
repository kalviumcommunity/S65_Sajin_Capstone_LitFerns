const mockBooks = require('../utils/mockData');

const getBooks = (req, res) => {
    res.status(200).json(mockBooks);
};

const getBookById = (req, res) => {
    const book = mockBooks.find((b) => b.id === req.params.id);

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
};

module.exports = { getBooks, getBookById };