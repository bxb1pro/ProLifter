require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Create the Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Link routes
const userRoutes = require('./routes/userRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const presetWorkoutRoutes = require('./routes/presetWorkoutRoutes');
const customWorkoutRoutes = require('./routes/customWorkoutRoutes');
const workoutLogRoutes = require('./routes/workoutLogRoutes');
const exerciseLogRoutes = require('./routes/exerciseLogRoutes');
const presetWorkoutExerciseRoutes = require('./routes/presetWorkoutExerciseRoutes');
const customWorkoutExerciseRoutes = require('./routes/customWorkoutExerciseRoutes');
const userPresetWorkoutRoutes = require('./routes/userPresetWorkoutRoutes');
const setLogRoutes = require('./routes/setLogRoutes');
const authRoutes = require('./routes/authRoutes');
const customTemplateCustomWorkoutRoutes = require('./routes/customTemplateCustomWorkoutRoutes');
const customTemplateRoutes = require('./routes/customTemplateRoutes');
const customTemplatePresetWorkoutRoutes = require('./routes/customTemplatePresetWorkoutRoutes');
const presetTemplateRoutes = require('./routes/presetTemplateRoutes');
const presetTemplatePresetWorkoutRoutes = require('./routes/presetTemplatePresetWorkoutRoutes');
const userPresetTemplateRoutes = require('./routes/userPresetTemplateRoutes');

// Set endpoints
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/preset-workouts', presetWorkoutRoutes);
app.use('/api/custom-workouts', customWorkoutRoutes); 
app.use('/api/workout-logs', workoutLogRoutes);
app.use('/api/exercise-logs', exerciseLogRoutes);
app.use('/api/preset-workout-exercises', presetWorkoutExerciseRoutes);
app.use('/api/custom-workout-exercises', customWorkoutExerciseRoutes);
app.use('/api/user-preset-workouts', userPresetWorkoutRoutes);
app.use('/api/set-logs', setLogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/custom-template-custom-workouts', customTemplateCustomWorkoutRoutes);
app.use('/api/custom-templates', customTemplateRoutes);
app.use('/api/custom-template-preset-workouts', customTemplatePresetWorkoutRoutes);
app.use('/api/preset-templates', presetTemplateRoutes);
app.use('/api/preset-template-preset-workouts', presetTemplatePresetWorkoutRoutes);
app.use('/api/user-preset-templates', userPresetTemplateRoutes);

module.exports = app;