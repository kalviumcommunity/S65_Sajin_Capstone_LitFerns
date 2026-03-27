const { createUploadthing, createRouteHandler } = require('uploadthing/express');

const f = createUploadthing({
  errorFormatter: (err) => ({
    message: err.message,
    code: err.code,
  }),
});

// Define file router configuration
const uploadRouter = {
  // Book cover file route
  bookCover: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .onUploadComplete(async (data) => {
      console.log('✅ File uploaded successfully!', {
        fileName: data.file.name,
        fileUrl: data.file.url,
        fileSize: data.file.size,
      });

      return {
        uploadedBy: 'user',
        url: data.file.url,
        name: data.file.name,
        key: data.file.key,
      };
    })
    .onUploadError((error) => {
      console.error('❌ Upload error:', error.message);
      throw error;
    }),
};

// Create the route handler using UploadThing's createRouteHandler
// This returns Express middleware that handles the upload
const handler = createRouteHandler({
  router: uploadRouter,
  config: {
    logLevel: 'info',
  },
});

module.exports = handler;
