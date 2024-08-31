const express = require('express');
const { fetchAllExercises, fetchExerciseDetails, fetchExercisesByBodyPart, fetchBodyPartList } = require('../controllers/exerciseController');

const router = express.Router();

// Route to get all exercises
router.get('/', fetchAllExercises);

// Route to get the list of body parts
router.get('/bodyPartList', fetchBodyPartList);

// Route to get exercises by body part
router.get('/bodyPart/:bodyPart', fetchExercisesByBodyPart);

// Route to get a specific exercise by ID
router.get('/:id', fetchExerciseDetails);

module.exports = router;