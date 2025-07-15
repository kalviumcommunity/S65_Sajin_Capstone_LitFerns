const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bookRoutes = require('./routes/bookRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config(); 

connectDB();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('LitFerns API is running...');
});

app.use('/api/books', bookRoutes);

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});