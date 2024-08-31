const { Exercise } = require('../models');
const { getAllExercises, getExerciseById, getExercisesByBodyPart, getBodyPartList} = require('../services/exerciseService');

// Fetch all exercises from the API (with a limit)
const fetchAllExercises = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 9999;
        const exercises = await getAllExercises(limit);
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

// Fetch exercises by body part
const fetchExercisesByBodyPart = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 9999;
        const exercises = await getExercisesByBodyPart(req.params.bodyPart, limit);
        res.status(200).json(exercises);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch body part list (to use in frontend filter search)
const fetchBodyPartList = async (req, res) => {
    try {
        const bodyParts = await getBodyPartList();
        res.status(200).json(bodyParts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    fetchAllExercises,
    fetchExerciseDetails,
    fetchExercisesByBodyPart,
    fetchBodyPartList,
};