const express = require('express');
const router = express.Router();
const {
    createSwapRequest,
    getMySwaps,
    updateSwapStatus,
    getSwapStats,
    deleteSwap,
    rateSwap,
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

router.route('/:id/rate').post(protect, rateSwap);

module.exports = router;
