const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    logoutUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Routes for registering and getting all users
router.route('/').post(registerUser).get(protect, admin, getUsers);

// Route for login
router.post('/login', authUser);
// Route for logout
router.post('/logout', logoutUser);

// Routes for user profile
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Routes for a specific user (Admin only)
router.route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

module.exports = router;