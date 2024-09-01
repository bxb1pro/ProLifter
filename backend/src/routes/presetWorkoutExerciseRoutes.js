const express = require('express');
const { linkExercise, unlinkExercise, getExercisesForPresetWorkout } = require('../controllers/presetWorkoutExerciseController');
const verifyRole = require('../middleware/roleMiddleware'); 

const router = express.Router();

// Link an exercise to a preset workout
router.post('/:id/link-exercise', verifyRole(['admin', 'superadmin']), linkExercise);

// Unlink an exercise from a preset workout
router.post('/:id/unlink-exercise', verifyRole(['admin', 'superadmin']), unlinkExercise);

// Get all exercises linked to a specific preset workout
router.get('/:id/exercises', getExercisesForPresetWorkout);

module.exports = router;
