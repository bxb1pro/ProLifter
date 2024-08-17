require('dotenv').config();

const express = require('express');
const userRoutes = require('./routes/userRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const presetWorkoutRoutes = require('./routes/presetWorkoutRoutes');
const customWorkoutRoutes = require('./routes/customWorkoutRoutes');
const workoutLogRoutes = require('./routes/workoutLogRoutes');
const exerciseLogRoutes = require('./routes/exerciseLogRoutes');
const presetWorkoutExerciseRoutes = require('./routes/presetWorkoutExerciseRoutes');
const customWorkoutExerciseRoutes = require('./routes/customWorkoutExerciseRoutes');
const userPresetWorkoutRoutes = require('./routes/userPresetWorkoutRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/preset-workouts', presetWorkoutRoutes);
app.use('/api/custom-workouts', customWorkoutRoutes); 
app.use('/api/workout-logs', workoutLogRoutes);
app.use('/api/exercise-logs', exerciseLogRoutes);
app.use('/api/preset-workout-exercises', presetWorkoutExerciseRoutes);
app.use('/api/custom-workout-exercises', customWorkoutExerciseRoutes);
app.use('/api/user-preset-workouts', userPresetWorkoutRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;