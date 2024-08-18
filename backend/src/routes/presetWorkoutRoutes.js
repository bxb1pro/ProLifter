const express = require('express');
const { createPresetWorkout, viewDetails, editPresetWorkout, deletePresetWorkout } = require('../controllers/presetWorkoutController');
const verifyRole = require('../middleware/roleMiddleware'); // Import middleware

const router = express.Router();

// Anyone can view preset workouts
router.get('/:id', viewDetails);

// Only admin and superadmin can create, edit, or delete preset workouts
router.post('/', verifyRole(['admin', 'superadmin']), createPresetWorkout);
router.put('/:id', verifyRole(['admin', 'superadmin']), editPresetWorkout);
router.delete('/:id', verifyRole(['admin', 'superadmin']), deletePresetWorkout);

module.exports = router;