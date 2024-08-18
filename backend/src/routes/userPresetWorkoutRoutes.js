const express = require('express');
const { linkPresetWorkout, unlinkPresetWorkout } = require('../controllers/userPresetWorkoutController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/:id/link-preset-workout', verifyRole(['user']), linkPresetWorkout);
router.post('/:id/unlink-preset-workout', verifyRole(['user']), unlinkPresetWorkout);

module.exports = router;