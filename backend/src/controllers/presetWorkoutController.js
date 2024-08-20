const { PresetWorkout } = require('../models');

const createPresetWorkout = async (req, res) => {
    try {
        const { presetWorkoutName, presetWorkoutDays, presetWorkoutDifficulty, presetWorkoutLocation } = req.body;

        const newWorkout = await PresetWorkout.create({
            presetWorkoutName,
            presetWorkoutDays,
            presetWorkoutDifficulty,
            presetWorkoutLocation,
        });

        res.status(201).json({ message: 'Preset workout created successfully', presetWorkoutID: newWorkout.presetWorkoutID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

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

const editPresetWorkout = async (req, res) => {
    try {
        const presetWorkoutID = req.params.id;
        const { presetWorkoutName, presetWorkoutDays, presetWorkoutDifficulty, presetWorkoutLocation } = req.body;

        const workout = await PresetWorkout.findByPk(presetWorkoutID);
        if (!workout) {
            return res.status(404).json({ error: 'Preset workout not found' });
        }

        workout.presetWorkoutName = presetWorkoutName || workout.presetWorkoutName;
        workout.presetWorkoutDays = presetWorkoutDays || workout.presetWorkoutDays;
        workout.presetWorkoutDifficulty = presetWorkoutDifficulty || workout.presetWorkoutDifficulty;
        workout.presetWorkoutLocation = presetWorkoutLocation || workout.presetWorkoutLocation;

        await workout.save();

        res.status(200).json({ message: 'Preset workout updated successfully', workout });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

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

const viewAllPresetWorkouts = async (req, res) => {
    try {
        const workouts = await PresetWorkout.findAll();  // Retrieve all preset workouts from the database
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