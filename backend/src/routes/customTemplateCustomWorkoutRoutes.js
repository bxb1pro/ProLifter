const express = require('express');
const { linkWorkout, unlinkWorkout, getCustomWorkoutsForCustomTemplate } = require('../controllers/customTemplateCustomWorkoutController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

// Link a custom workout to a custom template
router.post('/:id/link-workout', verifyRole(['user']), linkWorkout);

// Unlink a custom workout from a custom template
router.post('/:id/unlink-workout', verifyRole(['user']), unlinkWorkout);

// Get all custom workouts linked to a custom template
router.get('/:id/custom-workouts', verifyRole(['user']), getCustomWorkoutsForCustomTemplate);

module.exports = router;