const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not set');
        }

        const isSrv = mongoUri.startsWith('mongodb+srv://');

        const conn = await mongoose.connect(mongoUri, {
            ...(isSrv ? { retryWrites: true, w: 'majority' } : {}),
            // Connection pooling
            maxPoolSize: 10,
            minPoolSize: 2,
            // Timeout settings
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Listen for connection events
        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err.message);
        });
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        console.error('Full error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;