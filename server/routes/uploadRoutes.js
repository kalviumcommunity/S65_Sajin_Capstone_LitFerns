const express = require('express');
const { createRouteHandler } = require('uploadthing/express');
const { uploadRouter } = require('../utils/uploadthing');
const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log('Upload request received:', {
    method: req.method,
    url: req.url,
    contentType: req.headers['content-type'],
    token: process.env.UPLOADTHING_TOKEN?.substring(0, 50) + '...', // Log first 50 chars
  });
  next();
});

// Mount uploadthing API handler
router.use(
  '/',
  createRouteHandler({
    router: uploadRouter,
    config: {
      token: process.env.UPLOADTHING_TOKEN,
    },
  })
);

module.exports = router;