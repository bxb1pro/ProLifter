const express = require('express');
const {startExerciseLog, editExerciseLog, finishExerciseLog} = require('../controllers/exerciseLogController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/start', verifyRole(['user']), startExerciseLog);
router.put('/:id/edit', verifyRole(['user']), editExerciseLog);
router.put('/:id/finish', verifyRole(['user']), finishExerciseLog);

module.exports = router;
