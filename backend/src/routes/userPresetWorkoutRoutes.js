const express = require('express');
const { linkPresetWorkout, unlinkPresetWorkout } = require('../controllers/userPresetWorkoutController');

const router = express.Router();

router.post('/:id/link-preset-workout', linkPresetWorkout);
router.post('/:id/unlink-preset-workout', unlinkPresetWorkout);

module.exports = router;