const express = require('express');
const path = require('path');
const fs = require('fs');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

// Handle file uploads
router.post('/', uploadMiddleware.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Generate URL path for the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ message: 'File upload failed', error: err.message });
  }
});

module.exports = router;