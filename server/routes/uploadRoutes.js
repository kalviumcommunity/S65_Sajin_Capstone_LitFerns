const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Handle image upload
// POST /api/uploads
router.post('/', protect, upload.single('image'), (req, res) => {
    res.send({
        message: 'Image Uploaded Successfully',
        image: `/${req.file.path.replace(/\\/g, "/")}`,
    });
});

module.exports = router;