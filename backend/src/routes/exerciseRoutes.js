const express = require('express');
const { fetchExerciseDetails, suggestRPE } = require('../controllers/exerciseController');

const router = express.Router();

router.get('/:id', fetchExerciseDetails);
// router.get('/:id/suggest-rpe', suggestRPE);

module.exports = router;