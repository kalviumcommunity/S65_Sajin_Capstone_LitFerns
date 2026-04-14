const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book', 
            },
        ],
        location: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            default: '',
            maxlength: 500,
        },
        avatar: {
            type: String,
            default: '',
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        successfulSwaps: {
            type: Number,
            default: 0,
        },
        preferences: {
            emailNotifications: {
                type: Boolean,
                default: true,
            },
            swapNotifications: {
                type: Boolean,
                default: true,
            },
            messageNotifications: {
                type: Boolean,
                default: true,
            },
            favoriteGenres: [String],
            preferredFormats: [String],
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;