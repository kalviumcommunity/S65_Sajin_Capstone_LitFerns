const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        type: {
            type: String,
            required: true,
            enum: ['SwapRequest', 'SwapAccepted', 'SwapDeclined', 'SwapShipped', 'SwapCompleted', 'Message'],
        },
        content: {
            type: String,
            required: true,
        },
        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'onModel',
        },
        onModel: {
            type: String,
            enum: ['Swap', 'Book'],
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;