const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Book',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            required: true,
            maxlength: 150,
        },
        comment: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 2000,
        },
        helpful: {
            type: Number,
            default: 0,
        },
        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate reviews from same user on same book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
