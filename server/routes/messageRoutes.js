const express = require('express');
const router = express.Router();
const {
    getConversation,
    getInbox,
    sendMessage,
    getUnreadCount,
    markAsRead,
    deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// All message routes are protected
router.use(protect);

// Get inbox (all conversations)
router.get('/inbox', getInbox);

// Get unread message count
router.get('/unread/count', getUnreadCount);

// Get specific conversation
router.get('/conversation/:userId', getConversation);

// Send message
router.post('/', sendMessage);

// Mark messages from a user as read
router.put('/:senderId/read', markAsRead);

// Delete a message
router.delete('/:id', deleteMessage);

module.exports = router;
