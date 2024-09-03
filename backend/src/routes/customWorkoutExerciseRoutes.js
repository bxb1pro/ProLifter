const express = require('express');
const { linkExercise, unlinkExercise, getExercisesForCustomWorkout } = require('../controllers/customWorkoutExerciseController');
const verifyRole = require('../middleware/roleMiddleware'); 

const router = express.Router();

// Link exercise to a custom workout
router.post('/:id/link-exercise', verifyRole(['user']), linkExercise);

// Unlink an exercise from a custom workout
router.post('/:id/unlink-exercise', verifyRole(['user']), unlinkExercise);

// Get all exercises for a custom workout
router.get('/:id/exercises', verifyRole(['user']), getExercisesForCustomWorkout);

module.exports = router;