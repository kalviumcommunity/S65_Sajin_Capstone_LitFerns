const { createUploadthing } = require('uploadthing/express');

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  bookCover: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // For now, we'll fake authentication
      const user = { id: 'fakeId' };

      // If you throw, the user will not be able to upload
      if (!user) throw new Error('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId);
      console.log('file url', file.url);

      // !!! Whatever is returned here is sent to the client-side `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
};

module.exports = { uploadRouter };
