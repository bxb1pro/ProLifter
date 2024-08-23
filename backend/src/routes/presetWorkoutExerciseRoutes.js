const express = require('express');
const { linkExercise, unlinkExercise, getExercisesForPresetWorkout } = require('../controllers/presetWorkoutExerciseController');
const verifyRole = require('../middleware/roleMiddleware'); 

const router = express.Router();

router.post('/:id/link-exercise', verifyRole(['admin', 'superadmin']), linkExercise);
router.post('/:id/unlink-exercise', verifyRole(['admin', 'superadmin']), unlinkExercise);
router.get('/:id/exercises', getExercisesForPresetWorkout);

module.exports = router;
