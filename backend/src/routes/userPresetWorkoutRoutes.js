const express = require('express');
const { linkPresetWorkout, unlinkPresetWorkout, getUserPresetWorkouts } = require('../controllers/userPresetWorkoutController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

// Link a preset workout to a user
router.post('/:id/link-preset-workout', verifyRole(['user']), linkPresetWorkout);

// Unlink a preset workout from a user
router.post('/:id/unlink-preset-workout', verifyRole(['user']), unlinkPresetWorkout);

// Get all preset workouts for a user
router.get('/:id/preset-workouts', verifyRole(['user']), getUserPresetWorkouts);

module.exports = router;