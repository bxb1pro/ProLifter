const express = require('express');
const {startWorkout, finishWorkout, editWorkoutLog, deleteWorkoutLog, getUserWorkoutLogs, getWorkoutLogDetails} = require('../controllers/workoutLogController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/start', verifyRole(['user']), startWorkout);
router.put('/:id/finish', verifyRole(['user']), finishWorkout);
router.put('/:id/edit', verifyRole(['user']), editWorkoutLog);
router.delete('/:id/delete', verifyRole(['user']), deleteWorkoutLog);

// Get workout logs for a user (basic)
router.get('/', verifyRole(['user']), getUserWorkoutLogs);

// Get workout logs for a user (all set and exercise information attached)
router.get('/:id', verifyRole(['user']), getWorkoutLogDetails);

module.exports = router;