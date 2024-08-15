require('dotenv').config();

const express = require('express');
const userRoutes = require('./routes/userRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);

module.exports = app;