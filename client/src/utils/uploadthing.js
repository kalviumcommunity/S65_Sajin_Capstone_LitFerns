import { generateUploadButton, generateUploadDropzone } from '@uploadthing/react';
import { ourFileRouter } from '~/types/uploadthing';

// Get the API URL based on environment
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Generate upload components with server URL
export const UploadButton = generateUploadButton({
  url: `${apiUrl}/api/uploads`,
});

export const UploadDropzone = generateUploadDropzone({
  url: `${apiUrl}/api/uploads`,
});
