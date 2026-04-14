const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get conversation with a user
// @route   GET /api/messages/conversation/:userId
// @access  Private
const getConversation = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { limit = 50, page = 1 } = req.query;

    // Verify recipient user exists
    const recipient = await User.findById(userId);
    if (!recipient) {
        res.status(404);
        throw new Error('User not found');
    }

    const pageNum = Number(page) || 1;
    const pageSize = Math.min(Number(limit) || 50, 100);

    const messages = await Message.find({
        $or: [
            { sender: req.user._id, recipient: userId },
            { sender: userId, recipient: req.user._id },
        ],
    })
        .populate('sender', 'name email')
        .populate('recipient', 'name email')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (pageNum - 1));

    // Mark messages as read
    await Message.updateMany(
        { sender: userId, recipient: req.user._id, isRead: false },
        { isRead: true, readAt: new Date() }
    );

    res.json({
        messages: messages.reverse(),
        otherUser: {
            _id: recipient._id,
            name: recipient.name,
            email: recipient.email,
        },
    });
});

// @desc    Get all conversations (inbox)
// @route   GET /api/messages/inbox
// @access  Private
const getInbox = asyncHandler(async (req, res) => {
    const { limit = 20 } = req.query;

    // Get all unique conversations
    const conversations = await Message.aggregate([
        {
            $match: {
                $or: [{ sender: req.user._id }, { recipient: req.user._id }],
            },
        },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ['$sender', req.user._id] },
                        '$recipient',
                        '$sender',
                    ],
                },
                lastMessage: { $last: '$content' },
                lastMessageAt: { $last: '$createdAt' },
                unreadCount: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ['$recipient', req.user._id] },
                                    { $not: '$isRead' },
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },
            },
        },
        { $sort: { lastMessageAt: -1 } },
        { $limit: Number(limit) || 20 },
    ]);

    // Populate user details
    const populatedConversations = await Promise.all(
        conversations.map(async (conv) => {
            const user = await User.findById(conv._id).select('_id name email averageRating');
            return {
                user,
                lastMessage: conv.lastMessage,
                lastMessageAt: conv.lastMessageAt,
                unreadCount: conv.unreadCount,
            };
        })
    );

    res.json(populatedConversations);
});

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const { recipientId, content, swapId } = req.body;

    if (!recipientId || !content) {
        res.status(400);
        throw new Error('Recipient ID and message content are required');
    }

    if (recipientId === req.user._id.toString()) {
        res.status(400);
        throw new Error('Cannot send messages to yourself');
    }

    if (content.trim().length === 0 || content.length > 5000) {
        res.status(400);
        throw new Error('Message must be 1-5000 characters');
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
        res.status(404);
        throw new Error('Recipient not found');
    }

    const message = await Message.create({
        sender: req.user._id,
        recipient: recipientId,
        content: content.trim(),
        swap: swapId || null,
    });

    const populated = await message.populate([
        { path: 'sender', select: 'name email' },
        { path: 'recipient', select: 'name email' },
    ]);

    res.status(201).json(populated);
});

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
    const unreadCount = await Message.countDocuments({
        recipient: req.user._id,
        isRead: false,
    });

    res.json({ unreadCount });
});

// @desc    Mark messages as read
// @route   PUT /api/messages/:senderId/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const { senderId } = req.params;

    await Message.updateMany(
        { sender: senderId, recipient: req.user._id, isRead: false },
        { isRead: true, readAt: new Date() }
    );

    res.json({ message: 'Messages marked as read' });
});

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    if (message.sender.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this message');
    }

    await message.deleteOne();
    res.json({ message: 'Message deleted' });
});

module.exports = {
    getConversation,
    getInbox,
    sendMessage,
    getUnreadCount,
    markAsRead,
    deleteMessage,
};
