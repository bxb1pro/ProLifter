const express = require('express');
const {addSetLog, editSetLog, deleteSetLog, getUserSetLogsByExercise} = require('../controllers/setLogController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

// Add a set log
router.post('/', verifyRole(['user']), addSetLog);

// Edit a set log
router.put('/:id/edit', verifyRole(['user']), editSetLog);

// Delete a set log
router.delete('/:id/delete', verifyRole(['user']), deleteSetLog);

// Get set logs for a user specific to an exercise
router.get('/exercise/:exerciseLogID', verifyRole(['user']), getUserSetLogsByExercise);

module.exports = router;
