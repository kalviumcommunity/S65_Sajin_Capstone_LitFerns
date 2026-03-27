const express = require('express');
const path = require('path');
const fs = require('fs');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

// Handle file uploads
router.post('/', uploadMiddleware.single('file'), (req, res) => {
  try {
    console.log('📦 Upload endpoint hit');
    console.log('Body:', req.body);
    console.log('File received:', req.file ? `${req.file.filename} (${req.file.size} bytes)` : 'NO FILE');
    
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ message: 'No file provided' });
    }

    // Generate URL path for the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    
    console.log('✅ File saved to:', fileUrl);

    res.status(200).json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      fullPath: req.file.path,
    });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ message: 'File upload failed', error: err.message });
  }
});

module.exports = router;