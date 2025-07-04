const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bookRoutes = require('./routes/bookRoutes');

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());


app.get('/', (req, res) => {
    res.send('LitFerns API is running...');
});


app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});