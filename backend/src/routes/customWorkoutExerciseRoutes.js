const express = require('express');
const { linkExercise, unlinkExercise, getExercisesForCustomWorkout } = require('../controllers/customWorkoutExerciseController');
const verifyRole = require('../middleware/roleMiddleware'); 

const router = express.Router();

router.post('/:id/link-exercise', verifyRole(['user']), linkExercise);
router.post('/:id/unlink-exercise', verifyRole(['user']), unlinkExercise);
router.get('/:id/exercises', verifyRole(['user']), getExercisesForCustomWorkout);

module.exports = router;