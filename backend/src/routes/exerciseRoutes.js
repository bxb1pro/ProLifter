const express = require('express');
const { fetchAllExercises, fetchExerciseDetails } = require('../controllers/exerciseController');

const router = express.Router();

// Route to get all exercises
router.get('/', fetchAllExercises);

// Route to get a specific exercise by ID
router.get('/:id', fetchExerciseDetails);

module.exports = router;