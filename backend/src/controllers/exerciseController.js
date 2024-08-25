const { Exercise } = require('../models');
const { getAllExercises, getExerciseById } = require('../services/exerciseService');

// Fetch all exercises from the API
const fetchAllExercises = async (req, res) => {
    try {
        const exercises = await getAllExercises();
        res.status(200).json(exercises);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch a specific exercise by ID from the API
const fetchExerciseDetails = async (req, res) => {
    try {
        const exercise = await getExerciseById(req.params.id);
        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }
        res.status(200).json(exercise);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    fetchAllExercises,
    fetchExerciseDetails,
};