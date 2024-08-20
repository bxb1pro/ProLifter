const express = require('express');
const {startExerciseLog, editExerciseLog, finishExerciseLog, getUserExerciseLogsByWorkout} = require('../controllers/exerciseLogController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/start', verifyRole(['user']), startExerciseLog);
router.put('/:id/edit', verifyRole(['user']), editExerciseLog);
router.put('/:id/finish', verifyRole(['user']), finishExerciseLog);
router.get('/workout/:workoutLogID', verifyRole(['user']), getUserExerciseLogsByWorkout);

module.exports = router;
