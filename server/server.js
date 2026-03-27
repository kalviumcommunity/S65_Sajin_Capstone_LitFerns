
const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const swapRoutes = require('./routes/swapRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();


const app = express();
// CORS configuration for local and production
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
// Mount uploads BEFORE json middleware so multipart/form-data reaches UploadThing handler
app.use('/api/uploads', uploadRoutes);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('LitFerns API is running...');
});

app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Creating a function to start the server
const startServer = async () => {
    try {
        await connectDB();
        
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log('📁 uploads directory created');
        }
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database. Server is not running.', error);
        process.exit(1);
    }
};

startServer();