require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { uploadthing } = require('./utils/uploadthing');

const app = express();

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
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use('/api/uploadthing', uploadthing);

const PORT = process.env.UPLOAD_PORT || 5002;

app.listen(PORT, () => {
    console.log(`Upload server running on port ${PORT}`);
});
