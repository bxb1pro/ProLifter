const express = require('express');
const { createPresetWorkout, viewDetails, editPresetWorkout, deletePresetWorkout, viewAllPresetWorkouts } = require('../controllers/presetWorkoutController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

// View all preset workouts
router.get('/', viewAllPresetWorkouts);

// View a specific preset workout
router.get('/:id', viewDetails);

// Only admin and superadmin can create, edit, or delete preset workouts
router.post('/', verifyRole(['admin', 'superadmin']), createPresetWorkout);
router.put('/:id', verifyRole(['admin', 'superadmin']), editPresetWorkout);
router.delete('/:id', verifyRole(['admin', 'superadmin']), deletePresetWorkout);

module.exports = router;