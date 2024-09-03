const { PresetWorkout } = require('../models');

// Create a preset workout
const createPresetWorkout = async (req, res) => {
    try {
        const { presetWorkoutName, presetWorkoutDifficulty, presetWorkoutGoal, presetWorkoutLocation } = req.body;

        const newWorkout = await PresetWorkout.create({
            presetWorkoutName,
            presetWorkoutDifficulty,
            presetWorkoutGoal,
            presetWorkoutLocation,
        });

        res.status(201).json({ message: 'Preset workout created successfully', presetWorkoutID: newWorkout.presetWorkoutID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// View the details of a preset workout
const viewDetails = async (req, res) => {
    try {
        const workout = await PresetWorkout.findByPk(req.params.id);
        if (!workout) {
            return res.status(404).json({ error: 'Preset workout not found' });
        }
        res.status(200).json(workout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Edit a preset workout
const editPresetWorkout = async (req, res) => {
    try {
        const presetWorkoutID = req.params.id;
        const { presetWorkoutName, presetWorkoutDifficulty, presetWorkoutGoal, presetWorkoutLocation } = req.body;

        const workout = await PresetWorkout.findByPk(presetWorkoutID);
        if (!workout) {
            return res.status(404).json({ error: 'Preset workout not found' });
        }

        workout.presetWorkoutName = presetWorkoutName || workout.presetWorkoutName;
        workout.presetWorkoutDifficulty = presetWorkoutDifficulty || workout.presetWorkoutDifficulty;
        workout.presetWorkoutGoal = presetWorkoutGoal || workout.presetWorkoutGoal;
        workout.presetWorkoutLocation = presetWorkoutLocation || workout.presetWorkoutLocation;

        await workout.save();

        res.status(200).json({ message: 'Preset workout updated successfully', workout });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a preset workout
const deletePresetWorkout = async (req, res) => {
    try {
        const presetWorkoutID = req.params.id;

        const workout = await PresetWorkout.findByPk(presetWorkoutID);
        if (!workout) {
            return res.status(404).json({ error: 'Preset workout not found' });
        }

        await PresetWorkout.destroy({ where: { presetWorkoutID } });

        res.status(200).json({ message: 'Preset workout deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// View all preset workouts
const viewAllPresetWorkouts = async (req, res) => {
    try {
        const workouts = await PresetWorkout.findAll();
        res.status(200).json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createPresetWorkout,
    viewDetails,
    editPresetWorkout,
    deletePresetWorkout,
    viewAllPresetWorkouts,
};