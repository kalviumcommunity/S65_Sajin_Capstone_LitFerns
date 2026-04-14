const asyncHandler = require('express-async-handler');
const Follow = require('../models/Follow');
const User = require('../models/User');

// @desc    Follow a user
// @route   POST /api/follow/:userId
// @access  Private
const followUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
        res.status(400);
        throw new Error('Cannot follow yourself');
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
        follower: req.user._id,
        following: userId,
    });

    if (existingFollow) {
        res.status(400);
        throw new Error('You are already following this user');
    }

    await Follow.create({
        follower: req.user._id,
        following: userId,
    });

    res.status(201).json({ message: 'User followed successfully' });
});

// @desc    Unfollow a user
// @route   DELETE /api/follow/:userId
// @access  Private
const unfollowUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const result = await Follow.findOneAndDelete({
        follower: req.user._id,
        following: userId,
    });

    if (!result) {
        res.status(404);
        throw new Error('Not following this user');
    }

    res.json({ message: 'User unfollowed successfully' });
});

// @desc    Get user's followers
// @route   GET /api/follow/:userId/followers
// @access  Public
const getFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { limit = 20, page = 1 } = req.query;

    const pageNum = Number(page) || 1;
    const pageSize = Math.min(Number(limit) || 20, 50);

    const total = await Follow.countDocuments({ following: userId });

    const followers = await Follow.find({ following: userId })
        .populate('follower', 'name email averageRating')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (pageNum - 1));

    res.json({
        followers: followers.map((f) => f.follower),
        page: pageNum,
        pages: Math.ceil(total / pageSize),
        total,
    });
});

// @desc    Get user's following
// @route   GET /api/follow/:userId/following
// @access  Public
const getFollowing = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { limit = 20, page = 1 } = req.query;

    const pageNum = Number(page) || 1;
    const pageSize = Math.min(Number(limit) || 20, 50);

    const total = await Follow.countDocuments({ follower: userId });

    const following = await Follow.find({ follower: userId })
        .populate('following', 'name email averageRating')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (pageNum - 1));

    res.json({
        following: following.map((f) => f.following),
        page: pageNum,
        pages: Math.ceil(total / pageSize),
        total,
    });
});

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
const searchUsers = asyncHandler(async (req, res) => {
    const { q, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
        res.status(400);
        throw new Error('Search query is required');
    }

    const regex = new RegExp(q.trim(), 'i');
    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
    })
        .select('-password')
        .limit(Number(limit) || 20);

    // For each user, check if current user is following
    const usersWithFollowStatus = await Promise.all(
        users.map(async (user) => {
            let isFollowing = false;
            if (req.user) {
                const follow = await Follow.findOne({
                    follower: req.user._id,
                    following: user._id,
                });
                isFollowing = !!follow;
            }
            return {
                ...user.toObject(),
                isFollowing,
            };
        })
    );

    res.json(usersWithFollowStatus);
});

// @desc    Check if following a user
// @route   GET /api/follow/:userId/status
// @access  Private
const checkFollowStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const isFollowing = await Follow.findOne({
        follower: req.user._id,
        following: userId,
    });

    res.json({ isFollowing: !!isFollowing });
});

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    searchUsers,
    checkFollowStatus,
};
