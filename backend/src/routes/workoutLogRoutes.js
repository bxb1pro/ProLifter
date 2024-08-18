const express = require('express');
const {startWorkout, finishWorkout, editWorkoutLog, deleteWorkoutLog} = require('../controllers/workoutLogController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/start', verifyRole(['user']), startWorkout);
router.put('/:id/finish', verifyRole(['user']), finishWorkout);
router.put('/:id/edit', verifyRole(['user']), editWorkoutLog);
router.delete('/:id/delete', verifyRole(['user']), deleteWorkoutLog);

module.exports = router;