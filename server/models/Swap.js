const mongoose = require('mongoose');

const swapSchema = mongoose.Schema(
    {
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        requestedBooks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Book',
            },
        ],
        offeredBooks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book',
            },
        ],
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Declined', 'Shipped', 'In Transit', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
        message: {
            type: String,
            maxlength: 500,
            default: '',
        },
        trackingProgress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        requesterRating: {
            type: Number,
            min: 1,
            max: 5,
        },
        ownerRating: {
            type: Number,
            min: 1,
            max: 5,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate pending requests for the same book by the same user
// Note: This index may need adjustment if we want to allow multiple pending requests for different combinations
swapSchema.index({ requester: 1, requestedBooks: 1, status: 1 });

const Swap = mongoose.model('Swap', swapSchema);

module.exports = Swap;
