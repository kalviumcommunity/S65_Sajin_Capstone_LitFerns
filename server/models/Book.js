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
            default: '',
        },
        genre: {
            type: String,
            required: true,
        },
        condition: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
            minlength: 10,
        },
        publishedYear: {
            type: Number,
            min: 1400,
            max: new Date().getFullYear() + 1,
        },
        language: {
            type: String,
            default: 'English',
        },
        format: {
            type: String,
            enum: ['Hardcover', 'Paperback', 'Ebook', 'Audiobook', 'Other'],
            default: 'Paperback',
        },
        pages: {
            type: Number,
            min: 1,
        },
        location: {
            type: String,
            default: 'Unknown',
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        ratingsCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        tags: [String],
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