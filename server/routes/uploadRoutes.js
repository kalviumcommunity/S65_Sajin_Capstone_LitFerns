const express = require('express');
const router = express.Router();

// Note: Direct file uploads to UploadThing now happen from the client-side
// This route is kept for backwards compatibility if needed

router.post('/', (req, res) => {
  res.status(200).json({
    message: 'Direct uploads to UploadThing are handled client-side',
    info: 'Use @uploadthing/react useUploadThing hook',
  });
});

module.exports = router;