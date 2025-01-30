const express = require("express");
const cors = require("cors");
const priceRoute = require("./routes/prices.route");
const authRoute = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// CORS Options
const corsOptions = {
    origin: 'http://localhost:3000', // React frontend URL
    credentials: true,  // Allow credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware before routes
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Your Routes
app.use('/', priceRoute);
app.use('/auth/', authRoute);

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
