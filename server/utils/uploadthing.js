const { createUploadthing, createRouteHandler } = require("uploadthing/express");
 
const f = createUploadthing({
  secret: process.env.UPLOADTHING_SECRET,
});
 
const uploadRouter = {
  bookCover: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = { id: "fakeId" };
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
};
 
// Export the route handler for the Express app
module.exports = {
    uploadRouter,
    uploadthing: createRouteHandler({
        router: uploadRouter,
    })
};
