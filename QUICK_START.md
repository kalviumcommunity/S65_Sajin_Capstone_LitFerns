# 🚀 Quick Start Guide - LitFerns

## Prerequisites Check
```bash
# Check if Node.js is installed (should be v14+)
node --version

# Check if MongoDB is installed
mongod --version

# Or use MongoDB Atlas (cloud) - no local install needed
```

## First Time Setup (5 minutes)

### 1. Server Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env if needed (MongoDB URI, JWT secret)
```

### 2. Client Setup
```bash
cd client
npm install
# .env is optional for local development
```

### 3. Start MongoDB (if using local)
```bash
# In a new terminal
mongod
# Or use MongoDB Compass / Atlas
```

## Running the Application

### Start Both Server and Client

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```
✅ Server running on http://localhost:5000

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```
✅ Client running on http://localhost:5173

### Open Browser
Navigate to: **http://localhost:5173**

## Test the Application

### 1. Create Account
- Click "Login" → "Create Account"
- Fill: Name, Email, Password
- Click "Create Account"

### 2. Add a Book
- Go to "Profile"
- Click "Add a Book"
- Fill all fields + upload image
- Click "Add Book"

### 3. Browse Books
- Click "Browse"
- Use search and filters
- Click any book for details

## Common Issues

### MongoDB Connection Error
```bash
# Error: "Failed to connect to the database"
```
**Fix:** Ensure MongoDB is running or check your MONGO_URI in `.env`

### Port 5000 Already in Use
```bash
# Error: "EADDRINUSE: address already in use :::5000"
```
**Fix:** Change PORT in `server/.env` to 5001

### Can't Upload Images
**Fix:** Ensure `server/uploads/` directory exists

## Stop the Application

Press `Ctrl+C` in both terminal windows

## Need More Help?

Read full documentation:
- **SETUP_GUIDE.md** - Detailed setup instructions
- **PROJECT_REVIEW.md** - Complete project review and features
- **README.md** - Project overview

## Project URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Test:** http://localhost:5000/api/books

Happy Reading! 📚
