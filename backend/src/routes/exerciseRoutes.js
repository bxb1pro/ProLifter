const express = require('express');
const { fetchAllExercises, fetchExerciseDetails, fetchExercisesByBodyPart, fetchBodyPartList, fetchExerciseByName } = require('../controllers/exerciseController');

const router = express.Router();

// Get all exercises from the API
router.get('/', fetchAllExercises);

// Get a list of bodyparts from the API
router.get('/bodyPartList', fetchBodyPartList);

// Get exercises filtered by bodypart from the API
router.get('/bodyPart/:bodyPart', fetchExercisesByBodyPart);

// Get exercises by their specific name
router.get('/name/:name', fetchExerciseByName);

// Get a specific exercise by ID
router.get('/:id', fetchExerciseDetails);

module.exports = router;