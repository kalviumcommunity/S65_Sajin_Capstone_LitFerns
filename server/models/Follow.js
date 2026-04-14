const mongoose = require('mongoose');

const followSchema = mongoose.Schema(
    {
        follower: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        following: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate follows and self-follows
followSchema.pre('save', async function (next) {
    if (this.follower.toString() === this.following.toString()) {
        throw new Error('Cannot follow yourself');
    }
    next();
});

// Unique composite index to prevent duplicate follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;
