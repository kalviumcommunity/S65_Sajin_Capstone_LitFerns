const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        genre: {
            type: String,
            required: true,
        },
        condition: {
            type: String,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;