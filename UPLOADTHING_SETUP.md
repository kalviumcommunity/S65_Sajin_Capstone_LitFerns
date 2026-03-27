# UploadThing Integration Guide

## Overview
UploadThing is now integrated into your LitFerns project for secure, scalable file uploads (specifically book covers). This replaces the local file upload system with cloud storage.

## What's Been Implemented

### Backend (Express Server)
- ✅ `uploadthing` package installed
- ✅ `server/utils/uploadthing.js` - File router configuration with `bookCover` route
- ✅ `server/routes/uploadRoutes.js` - Express route handler for uploads
- ✅ Environment variable `UPLOADTHING_TOKEN` added to `.env`

### Frontend (React/Vite)
- ✅ `@uploadthing/react` and `uploadthing` packages installed  
- ✅ `client/src/utils/uploadthing.js` - Upload components configured for Express backend
- ✅ `client/src/types/uploadthing.js` - TypeScript type definitions
- ✅ `client/src/components/BookCoverUpload.jsx` - Reusable upload component

## Setup Instructions

### 1. Get Your UploadThing API Key

1. Go to [uploadthing.com](https://uploadthing.com)
2. Sign up or log in
3. Create an app
4. Copy your API key

### 2. Add the API Key to Environment Variables

**For Backend (Render):**
- Go to Render Dashboard → Your Backend Service → Environment
- Add: `UPLOADTHING_TOKEN=sk_live_...` (your actual API key)
- Redeploy

**For Local Development:**
- Update `server/.env`:
  ```
  UPLOADTHING_TOKEN=sk_live_...
  ```

**For Frontend (Vercel - if needed):**
- The frontend uses the backend URL, so no frontend env var needed

### 3. Update Firewall/CORS Rules

If you have firewall restrictions, allow requests to:
- `ingest.uploadthing.com` (upload endpoint)
- `ufs.sh` (CDN for serving images)

## Configuration Details

### Book Cover Route (`bookCover`)
Located in `server/utils/uploadthing.js`:

```javascript
bookCover: f({
  image: {
    maxFileSize: '4MB',
    maxFileCount: 1,
  },
}).onUploadComplete((data) => {
  // Returns the uploadthing URL
  return {
    fileUrl: data.file.ufsUrl || data.file.url,
  };
})
```

### API Endpoint
- **Route:** `/api/uploads`
- **Method:** `POST`
- **URL Format:** `https://<APP_ID>.ufs.sh/f/<FILE_KEY>`

## Using the Upload Component

### In UserProfilePage (Add Book Modal)

Replace the existing image upload section with:

```jsx
import { BookCoverUpload } from '../components/BookCoverUpload';

// In your form:
<BookCoverUpload 
  onUploadComplete={(fileUrl) => {
    setFormData({ ...formData, image: fileUrl });
  }}
  imagePreview={imagePreview}
  setImagePreview={setImagePreview}
  imageFile={imageFile}
  setImageFile={setImageFile}
/>
```

### In handleAddBook Function

Update the image upload logic:

```javascript
let imagePath = '';
if (imageFile) {
  const fd = new FormData();
  fd.append('image', imageFile);
  const res = await axios.post('/api/uploads', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  imagePath = res.data?.file?.url || res.data?.file?.ufsUrl || '';
}
```

## File Serving

All uploaded files are accessible via UploadThing's CDN:

```
https://<YOUR_APP_ID>.ufs.sh/f/<FILE_KEY>
```

The `getImageUrl()` utility can be updated to recognize and serve UploadThing URLs directly.

## Troubleshooting

### "UPLOADTHING_TOKEN not found"
- Make sure you've added the env variable to both local `.env` and Render environment
- Restart your server after adding the env variable

### 404 errors on uploaded images
- Verify the API key is correct
- Check that the image URL format is `https://<APP_ID>.ufs.sh/f/<FILE_KEY>`
- Ensure the file was uploaded successfully (check server logs)

### Upload fails on frontend
- Check browser console for specific error messages
- Verify API URL is correct (should be your Render backend URL in production)
- Check that CORS is properly configured on the backend

### File not persisting
- Make sure `onUploadComplete` is returning the correct file URL
- Verify the image URL is being saved to the book's `image` field in MongoDB

## Security Features

- ✅ File type validation (images only)
- ✅ File size limits (4MB max)
- ✅ API key protected  
- ✅ CORS configured for your domain
- ✅ Files served via signed CDN URLs

## Next Steps

1. Set your UPLOADTHING_TOKEN in all environments
2. Test uploading a book cover through the UI
3. Verify the image appears in the book details page
4. Monitor UploadThing dashboard for upload stats

## Useful Links

- [UploadThing Docs](https://docs.uploadthing.com)
- [Dashboard](https://uploadthing.com/dashboard)
- [API Reference](https://docs.uploadthing.com/api-reference)
