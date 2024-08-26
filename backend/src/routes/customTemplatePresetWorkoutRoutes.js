const express = require('express');
const { linkPresetWorkout, unlinkPresetWorkout, getPresetWorkoutsForCustomTemplate } = require('../controllers/customTemplatePresetWorkoutController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

// Link a preset workout to a custom template
router.post('/:id/link-preset-workout', verifyRole(['user']), linkPresetWorkout);

// Unlink a preset workout from a custom template
router.post('/:id/unlink-preset-workout', verifyRole(['user']), unlinkPresetWorkout);

// Get all preset workouts linked to a custom template
router.get('/:id/preset-workouts', verifyRole(['user']), getPresetWorkoutsForCustomTemplate);

module.exports = router;