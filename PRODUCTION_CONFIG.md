# Production Environment Configuration Guide

## Issue Summary
Your frontend (Vercel) was trying to reach `http://localhost:5000` instead of your Render backend, causing CORS and connection errors (Status 0) and 500 errors.

## What Was Fixed

### Local Development
- Created `.env.development` with `VITE_API_URL=http://localhost:5000`
- Allows developers to run locally with the backend on port 5000

### Backend (Render)
- Updated MongoDB URI to include database name: `litferns`
- Set `NODE_ENV=production`
- Configured `FRONTEND_URL=https://capstone-sajins-25.vercel.app`
- CORS is already configured to use `FRONTEND_URL`

## Next Steps: Configure Vercel Environment Variables

You **must** set the following in Vercel's dashboard for production to work:

### Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add this variable:
```
VITE_API_URL = https://s65-sajin-capstone-litferns.onrender.com
```

Set it for:
- ☑️ Production
- ☑️ Preview  
- ☑️ Development (optional)

## Verify Render Backend Configuration

Make sure your Render backend has these environment variables set:

```
MONGO_URI=mongodb+srv://sajinsajigeorge_db_user:paperboat2005@clusterai.o32sbyw.mongodb.net/litferns
NODE_ENV=production
PORT=5000
JWT_SECRET=yourrandomsecretstring12345
FRONTEND_URL=https://capstone-sajins-25.vercel.app
```

## Testing the Fix

1. **Restart Vercel deployment**: Redeploy after setting the env variable
2. **Check frontend logs**: Open browser DevTools Console when visiting https://capstone-sajins-25.vercel.app
3. **Check backend logs**: Visit Render dashboard to view server logs for any 500 errors
4. **Test an API call**: Try navigating to /dashboard or making an API request and check the Network tab

## How It Works Now

```
Frontend (Vercel)
  ↓ HTTPS
  ↓ VITE_API_URL=https://s65-sajin-capstone-litferns.onrender.com
  ↓ 
Backend (Render)
  ↓ CORS allows origin: https://capstone-sajins-25.vercel.app
  ↓ 
Database (MongoDB Atlas)
```

## Common Issues & Solutions

### Still Getting CORS Errors?
- Verify `FRONTEND_URL` on Render matches the exact Vercel URL
- Check Vercel deployment has the new `VITE_API_URL` env variable
- Trigger a new deployment on Vercel (even if no code changed)

### Still Getting 500 Errors?
- Check Render server logs for detailed error messages
- Verify `MONGO_URI` is complete and correct on Render
- Check JWT_SECRET and other credentials are properly set

### Mixed Content (if using HTTPS frontend with HTTP backend)
- ✅ Already fixed: Using HTTPS Render backend with HTTPS Vercel frontend
