
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('LitFerns API is running...');
});

app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);

app.use('/uploads', express.static(path.join(__dirname, '/server/uploads')));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Creating a function to start the server
const startServer = async () => {
    try {
        await connectDB(); 
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database. Server is not running.', error);
        process.exit(1);
    }
};

startServer();