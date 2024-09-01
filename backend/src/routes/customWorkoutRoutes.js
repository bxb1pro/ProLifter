const express = require('express');
const {createWorkout, viewWorkout, editWorkout, deleteWorkout, getUserCustomWorkouts} = require('../controllers/customWorkoutController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

// Create a custom workout
router.post('/', verifyRole(['user']), createWorkout);

// View a custom workout
router.get('/:id', verifyRole(['user']), viewWorkout);

// Edit a custom workout
router.put('/:id/edit', verifyRole(['user']), editWorkout);

// Delete a custom workout
router.delete('/:id/delete', verifyRole(['user']), deleteWorkout);

// Get custom workouts for a user
router.get('/', verifyRole(['user']), getUserCustomWorkouts);

module.exports = router;