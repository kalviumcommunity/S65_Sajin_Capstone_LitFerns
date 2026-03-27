// Type definitions for UploadThing
// This file defines the shape of the FileRouter on the server

export type OurFileRouter = {
  bookCover: {
    fileTypes: ['image'];
    maxFileCount: 1;
    maxFileSize: '4MB';
  };
};
