const express = require('express');
const router = express.Router();
const {
    createSwapRequest,
    getMySwaps,
    updateSwapStatus,
    getSwapStats,
    deleteSwap,
} = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

// Public stats endpoint
router.get('/stats', getSwapStats);

// Protected routes
router.route('/')
    .get(protect, getMySwaps)
    .post(protect, createSwapRequest);

router.route('/:id')
    .put(protect, updateSwapStatus)
    .delete(protect, deleteSwap);

module.exports = router;
