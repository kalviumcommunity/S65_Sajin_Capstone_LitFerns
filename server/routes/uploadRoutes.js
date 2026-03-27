const express = require('express');
const { createRouteHandler } = require('uploadthing/express');
const { uploadRouter } = require('../utils/uploadthing');
const router = express.Router();

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