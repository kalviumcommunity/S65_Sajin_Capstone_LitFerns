# LitFerns - Setup and Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (cloud)
- **Git** - [Download](https://git-scm.com/)

## Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd capstone
```

### 2. Server Setup

#### Navigate to server directory
```bash
cd server
```

#### Install dependencies
```bash
npm install
```

#### Create environment file
```bash
# Copy the example env file
cp .env.example .env
```

#### Configure environment variables
Edit the `.env` file with your settings:
```env
MONGO_URI=mongodb://localhost:27017/litferns
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Important Notes:**
- For **MongoDB Atlas**: Replace `MONGO_URI` with your Atlas connection string
- For **JWT_SECRET**: Use a strong random string (you can generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

### 3. Client Setup

#### Navigate to client directory (from root)
```bash
cd ../client
```

#### Install dependencies
```bash
npm install
```

#### Create environment file
```bash
# Copy the example env file
cp .env.example .env
```

#### Configure environment variables (optional for local development)
Edit the `.env` file:
```env
# Leave empty for local development (Vite proxy will handle it)
VITE_API_URL=

# For production deployment, set this to your backend URL:
# VITE_API_URL=https://your-backend.onrender.com
```

## Running the Application

### Development Mode

You'll need **two terminal windows**:

#### Terminal 1 - Start the Server
```bash
cd server
npm run dev
```
Server will run on: `http://localhost:5000`

#### Terminal 2 - Start the Client
```bash
cd client
npm run dev
```
Client will run on: `http://localhost:5173`

### Production Mode

#### Build the client
```bash
cd client
npm run build
```

#### Start the server
```bash
cd server
npm start
```

## Testing the Application

### 1. Create a User Account
1. Open `http://localhost:5173` in your browser
2. Click "Login" or navigate to `/login`
3. Click "Create Account"
4. Fill in:
   - Full Name
   - Email
   - Password
5. Click "Create Account"

### 2. Add a Book
1. After logging in, go to "Profile" page
2. Click "Add a Book"
3. Fill in the book details:
   - Title
   - Author
   - Genre
   - Condition
   - Upload an image
4. Click "Add Book"

### 3. Browse Books
1. Navigate to "Browse" page
2. Use filters to search by:
   - Title or Author (search bar)
   - Genre (sidebar)
3. Click on any book to view details

### 4. View Dashboard
1. Navigate to "Swap Dashboard"
2. View your active swaps and requests (mock data for now)
3. See "My Books" section at the bottom

## Common Issues & Solutions

### MongoDB Connection Issues
```bash
# Error: "Failed to connect to the database"
```
**Solution:**
- Ensure MongoDB is running locally: `mongod`
- Or check your MongoDB Atlas connection string
- Verify `MONGO_URI` in `.env` is correct

### Port Already in Use
```bash
# Error: "Port 5000 is already in use"
```
**Solution:**
- Change `PORT` in `server/.env` to another port (e.g., 5001)
- Update Vite proxy in `client/vite.config.js` if needed

### Image Upload Issues
```bash
# Error: "Failed to upload image"
```
**Solution:**
- Ensure `server/uploads/` directory exists
- Check file size (max 5MB)
- Verify file format (jpg, jpeg, png only)

### CORS Errors
```bash
# Error: "CORS policy blocked"
```
**Solution:**
- Verify `FRONTEND_URL` in server `.env` matches your client URL
- In development, use `http://localhost:5173`
- Ensure `axios.defaults.withCredentials = true` is set in client

## Environment Variables Reference

### Server (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| MONGO_URI | MongoDB connection string | `mongodb://localhost:27017/litferns` |
| JWT_SECRET | Secret key for JWT tokens | `your_secret_key_here` |
| NODE_ENV | Environment mode | `development` or `production` |
| PORT | Server port | `5000` |
| FRONTEND_URL | Client URL for CORS | `http://localhost:5173` |

### Client (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | Leave empty for local dev, or `https://api.example.com` for production |

## API Endpoints

### Authentication
- `POST /api/users` - Register user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book (protected)
- `PUT /api/books/:id` - Update book (protected)
- `DELETE /api/books/:id` - Delete book (protected)
- `GET /api/books/mybooks` - Get logged-in user's books (protected)

### Uploads
- `POST /api/uploads` - Upload image (protected)

### Wishlist
- `POST /api/users/wishlist` - Add to wishlist (protected)
- `DELETE /api/users/wishlist/:bookId` - Remove from wishlist (protected)

## Deployment

### Deploy to Render (Backend)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**: Add all from `server/.env`
5. Deploy!

### Deploy to Vercel (Frontend)

1. Create account on [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `client`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: 
     - `VITE_API_URL`: Your Render backend URL
4. Deploy!

## Project Structure

```
capstone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                # Express backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── uploads/          # Uploaded images
│   ├── utils/            # Utility functions
│   ├── server.js         # Entry point
│   └── package.json
│
└── README.md
```

## Features Implemented

✅ User authentication (signup/login/logout)
✅ Book listing and browsing
✅ Book filtering by genre and search
✅ Add/Edit/Delete books (owner only)
✅ Image upload for books
✅ User profile management
✅ Wishlist (localStorage)
✅ Responsive design
✅ Protected routes
✅ Error handling

## Support

For issues or questions:
1. Check this README
2. Review error messages in browser console and server logs
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running

## License

This project is licensed under the ISC License.
