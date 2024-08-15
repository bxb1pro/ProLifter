const express = require('express');
const {
    addExercise,
    removeExercise,
    editWorkout,
    deleteWorkout
} = require('../controllers/customWorkoutController');

const router = express.Router();

//router.post('/:id/add-exercise', addExercise);
//router.post('/:id/remove-exercise', removeExercise);
router.put('/:id/edit', editWorkout);
router.delete('/:id/delete', deleteWorkout);

module.exports = router;