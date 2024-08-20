const express = require('express');
const {createWorkout, viewWorkout, editWorkout, deleteWorkout, getUserCustomWorkouts} = require('../controllers/customWorkoutController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', verifyRole(['user']), createWorkout);
router.get('/:id', verifyRole(['user']), viewWorkout);
router.put('/:id/edit', verifyRole(['user']), editWorkout);
router.delete('/:id/delete', verifyRole(['user']), deleteWorkout);
router.get('/', verifyRole(['user']), getUserCustomWorkouts);

module.exports = router;