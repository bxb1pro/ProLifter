const express = require('express');
const { linkPresetWorkout, unlinkPresetWorkout, getPresetWorkoutsForPresetTemplate } = require('../controllers/presetTemplatePresetWorkoutController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

// Link a preset workout to a preset template
router.post('/:id/link-preset-workout', verifyRole(['admin', 'superadmin']), linkPresetWorkout);

// Unlink a preset workout from a preset template
router.post('/:id/unlink-preset-workout', verifyRole(['admin', 'superadmin']), unlinkPresetWorkout);

// Get all preset workouts linked to a preset template
router.get('/:id/preset-workouts', verifyRole(['admin', 'superadmin']), getPresetWorkoutsForPresetTemplate);

module.exports = router;