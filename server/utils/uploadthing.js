const { createUploadthing, UploadThingError } = require('uploadthing/express');

const f = createUploadthing();

// FileRouter for book cover uploads
const uploadRouter = {
  // Book cover upload route
  bookCover: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .onUploadComplete((data) => {
      console.log('Book cover upload completed:', data);
      
      return {
        uploadedBy: 'user',
        fileUrl: data.file.ufsUrl || data.file.url,
        fileKey: data.file.key,
        fileName: data.file.name,
      };
    }),
};

module.exports = { uploadRouter };
