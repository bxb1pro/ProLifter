const express = require('express');
const {createWorkout, viewWorkout, editWorkout, deleteWorkout} = require('../controllers/customWorkoutController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', verifyRole(['user']), createWorkout);
router.get('/:id', verifyRole(['user']), viewWorkout);
router.put('/:id/edit', verifyRole(['user']), editWorkout);
router.delete('/:id/delete', verifyRole(['user']), deleteWorkout);

module.exports = router;