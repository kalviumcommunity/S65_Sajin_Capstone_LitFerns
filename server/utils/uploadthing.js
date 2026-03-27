const { createUploadthing, createRouteHandler } =require('uploadthing/express');

const f = createUploadthing();

// Define file router configuration for book covers
const uploadRouter = {
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
    .onUploadError(async (error) => {
      console.error('❌ Upload error:', error);
      throw error;
    }),
};

// Create the route handler
// This should return Express middleware
module.exports = createRouteHandler({
  router: uploadRouter,
});
