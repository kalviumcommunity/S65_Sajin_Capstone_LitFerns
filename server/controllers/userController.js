const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
// Logout user - clear cookie
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
    });
    res.status(200).json({ message: 'Logged out successfully' });
});


// Auth user & get token (Login)
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please enter all fields');
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, 
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please enter all fields');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
    });
    
    if (user) {
        const token = generateToken(user._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// Get user profile
// GET /api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            wishlist: user.wishlist,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Update user profile
// PUT /api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        if (req.body.email) {
            const userExists = await User.findOne({ email: req.body.email });
            if (userExists && userExists._id.toString() !== user._id.toString()) {
                res.status(400);
                throw new Error('Email is already in use');
            }
            user.email = req.body.email;
        }

        user.name = req.body.name || user.name;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Get all users
// GET /api/users
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

// Delete a user
// DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        const userName = user.name;
        const userEmail = user.email;

        await user.deleteOne();

        res.json({ message: `User '${userName}' (${userEmail}) has been removed.` });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Get user by ID
// GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Update user by ID
// PUT /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        // Only update isAdmin if it's explicitly passed in the body
        if (req.body.isAdmin !== undefined) {
          user.isAdmin = req.body.isAdmin;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Add a book to user's wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    const { bookId } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        if (user.wishlist.includes(bookId)) {
            res.status(400);
            throw new Error('Book already in wishlist');
        }
        user.wishlist.push(bookId);
        await user.save();
        res.status(201).json({ message: 'Book added to wishlist' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Remove a book from user's wishlist
// @route   DELETE /api/users/wishlist/:bookId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);

    if (user) {
        user.wishlist.pull(bookId); // Mongoose's .pull() method removes the item from the array
        await user.save();
        res.json({ message: 'Book removed from wishlist' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});




module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    logoutUser,
    addToWishlist,
    removeFromWishlist,
};