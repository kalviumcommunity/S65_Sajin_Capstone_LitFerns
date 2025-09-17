const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, upload.single('image'), (req, res) => {
    // ADD: Check if a file was actually uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image file.' });
    }
    
    res.send({
        message: 'Image Uploaded Successfully',
        image: `/${req.file.path.replace(/\\/g, "/")}`,
    });
});

module.exports = router;