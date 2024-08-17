const express = require('express');
const { linkExercise, unlinkExercise } = require('../controllers/presetWorkoutExerciseController');

const router = express.Router();

router.post('/:id/link-exercise', linkExercise);
router.post('/:id/unlink-exercise', unlinkExercise);

module.exports = router;