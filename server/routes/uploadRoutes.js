const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');
const router = express.Router();

router.post('/', protect, upload.single('image'), asyncHandler(async (req, res) => {
    // Check if a file was actually uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image file.' });
    }
    
    // Validate file was saved correctly
    if (!req.file.path) {
        res.status(500);
        throw new Error('File upload failed');
    }
    
    res.status(200).json({
        message: 'Image Uploaded Successfully',
        image: `/${req.file.path.replace(/\\/g, "/")}`,
    });
}));

module.exports = router;