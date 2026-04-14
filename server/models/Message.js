const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        content: {
            type: String,
            required: true,
            maxlength: 5000,
        },
        swap: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Swap',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying of conversations
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ recipient: 1, isRead: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
