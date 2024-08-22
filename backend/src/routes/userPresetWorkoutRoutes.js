const express = require('express');
const { linkPresetWorkout, unlinkPresetWorkout, getUserPresetWorkouts } = require('../controllers/userPresetWorkoutController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/:id/link-preset-workout', verifyRole(['user']), linkPresetWorkout);
router.post('/:id/unlink-preset-workout', verifyRole(['user']), unlinkPresetWorkout);
router.get('/:id/preset-workouts', verifyRole(['user']), getUserPresetWorkouts);

module.exports = router;