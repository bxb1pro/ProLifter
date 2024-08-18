const express = require('express');
const { fetchAllExercises, fetchExerciseDetails, suggestRPE } = require('../controllers/exerciseController');

const router = express.Router();

// Route to get all exercises
router.get('/', fetchAllExercises);

// Route to get a specific exercise by ID
router.get('/:id', fetchExerciseDetails);

// router.get('/:id/suggest-rpe', suggestRPE);

module.exports = router;