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
        requestedBook: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Book',
        },
        offeredBook: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            default: null,
        },
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
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate pending requests for the same book by the same user
swapSchema.index({ requester: 1, requestedBook: 1, status: 1 });

const Swap = mongoose.model('Swap', swapSchema);

module.exports = Swap;
