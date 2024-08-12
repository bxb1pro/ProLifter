require('dotenv').config();

const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Mount the user routes
app.use('/api/users', userRoutes);

module.exports = app;