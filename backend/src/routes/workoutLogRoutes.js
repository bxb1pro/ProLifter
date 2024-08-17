const express = require('express');
const {
    startWorkout,
    finishWorkout,
    //addExerciseLog,
    editWorkoutLog,
    deleteWorkoutLog
} = require('../controllers/workoutLogController');

const router = express.Router();

router.post('/start', startWorkout);
router.put('/:id/finish', finishWorkout);
//router.post('/:id/add-exercise-log', addExerciseLog);
router.put('/:id/edit', editWorkoutLog);
router.delete('/:id/delete', deleteWorkoutLog);

module.exports = router;