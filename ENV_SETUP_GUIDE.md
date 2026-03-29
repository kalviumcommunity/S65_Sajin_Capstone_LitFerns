# Environment Configuration Guide

## Overview

This project uses environment variables for configuration. Different environments (development, production) have different settings.

## Development Setup

### Client (.env.development)
```env
VITE_API_URL=http://localhost:5000
VITE_UPLOAD_API_URL=http://localhost:5000
```

### Server (.env.development) 
Create this file locally using `.env.development.example`:
```bash
cp server/.env.development.example server/.env.development
```

Then edit with your local values:
```env
MONGO_URI=mongodb://localhost:27017/litferns
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_local_dev_secret_here
UPLOADTHING_TOKEN=sk_live_your_dev_token_here
```

**Important:** Never commit `.env.development` - it's in `.gitignore`

## Production Setup

### Server Environment Variables (on Render/Vercel)

Use the `.env.production.example` as a guide. Set these in your deployment platform's dashboard:

**On Render:**
1. Go to your service → Settings → Environment
2. Add each variable from `.env.production.example`
3. Deploy

**On Vercel:**
1. Project Settings → Environment Variables  
2. Add each variable from `.env.production.example`
3. Redeploy

**Key Production Variables:**
- `MONGO_URI` - Your MongoDB Atlas connection string with NEW credentials
- `JWT_SECRET` - Brand new random secret (not dev secret)
- `UPLOADTHING_TOKEN` - Regenerated API token
- `NODE_ENV` - Set to "production"
- `FRONTEND_URL` - Your actual deployed frontend URL

### Client Production Build

The client automatically uses production URLs if you set `VITE_API_URL` in `.env.production` or via build environment variables.

**For Vercel (automatic):**
- Set `VITE_API_URL` in Project Settings → Environment Variables
- Values are injected at build time

**For other hosts:**
- Build with: `npm run build`
- The dist folder is ready to deploy

## Important Notes

1. **Never commit .env files** - Only commit `.env.example` and `.env.*.example` files
2. **Different secrets per environment** - Don't reuse dev secrets in production
3. **Same API server for both API and uploads** - Both use the main server (port 5000 locally, your domain in production)
4. **CORS is environment-aware** - `FRONTEND_URL` is added to allowed origins automatically
5. **Both servers merged** - `upload-server.js` is now optional; main `server.js` handles everything

## File Structure

```
server/
  .env.development.example    ← Template for local development
  .env.production.example     ← Template for production
  .env.development           ← Local only (in .gitignore)
  
client/
  .env.development           ← Local only (in .gitignore)
  .env.production.example    ← Template for production builds
```

## Troubleshooting

**"Cannot find module dotenv"** 
- Run `npm install` in the server directory

**CORS errors in browser**
- Check that `VITE_API_URL` matches where your server is actually running
- Verify `FRONTEND_URL` on server matches your client URL

**Uploads not working**
- Ensure `VITE_UPLOAD_API_URL` points to same server as `VITE_API_URL`
- Check `UPLOADTHING_TOKEN` is set correctly
- In production, token must exist and be valid

**Database connection errors**
- Verify `MONGO_URI` is correct and credentials haven't expired
- If rotated credentials, update `.env.production` in deployment platform
