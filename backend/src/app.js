require('dotenv').config();

const express = require('express');
const userRoutes = require('./routes/userRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const presetWorkoutRoutes = require('./routes/presetWorkoutRoutes');
const customWorkoutRoutes = require('./routes/customWorkoutRoutes');
const workoutLogRoutes = require('./routes/workoutLogRoutes');
const exerciseLogRoutes = require('./routes/exerciseLogRoutes');

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/preset-workouts', presetWorkoutRoutes);
app.use('/api/custom-workouts', customWorkoutRoutes); 
app.use('/api/workout-logs', workoutLogRoutes);
app.use('/api/exercise-logs', exerciseLogRoutes);

module.exports = app;