const express = require('express');
const router = express.Router();
const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    searchUsers,
    checkFollowStatus,
} = require('../controllers/followController');
const { protect } = require('../middleware/authMiddleware');

// Search users (public)
router.get('/search', searchUsers);

// Get followers (public)
router.get('/:userId/followers', getFollowers);

// Get following (public)
router.get('/:userId/following', getFollowing);

// Follow/unfollow (protected)
router.post('/:userId', protect, followUser);
router.delete('/:userId', protect, unfollowUser);

// Check follow status (protected)
router.get('/:userId/status', protect, checkFollowStatus);

module.exports = router;
