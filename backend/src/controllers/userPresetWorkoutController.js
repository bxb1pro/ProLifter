const { UserPresetWorkout, PresetWorkout, User } = require('../models');

// Link a preset workout to a user
const linkPresetWorkout = async (req, res) => {
    try {
        const { presetWorkoutID } = req.body;
        const userID = req.params.id;

        // Make sure both user and preset workout exist
        const user = await User.findByPk(userID);
        const workout = await PresetWorkout.findByPk(presetWorkoutID);

        if (!user || !workout) {
            return res.status(404).json({ error: 'User or preset workout not found' });
        }

        // Check if the preset workout is already linked to the user
        const existingLink = await UserPresetWorkout.findOne({
            where: { userID, presetWorkoutID }
        });

        if (existingLink) {
            return res.status(409).json({ error: 'Preset workout is already linked to this user' });
        }

        // Create the link with the current date
        await UserPresetWorkout.create({
            userID,
            presetWorkoutID,
            dateSelected: new Date(),
        });

        res.status(200).json({ message: 'Preset workout linked to user successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Unlink a preset workout from a user
const unlinkPresetWorkout = async (req, res) => {
    try {
        const { presetWorkoutID } = req.body;
        const userID = req.params.id;

        // Find and delete link
        await UserPresetWorkout.destroy({ where: { userID, presetWorkoutID } });

        res.status(200).json({ message: 'Preset workout unlinked from user successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all preset workouts linked to a user
const getUserPresetWorkouts = async (req, res) => {
    try {
        const userID = req.params.id;

        // Fetch all preset workouts linked to the user
        const userPresetWorkouts = await UserPresetWorkout.findAll({
            where: { userID },
            include: [{ model: PresetWorkout }] // Include the PresetWorkout model to get workout details
        });

        if (!userPresetWorkouts) {
            return res.status(404).json({ error: 'No preset workouts found for this user' });
        }

        // Extract the preset workouts from the linked data
        const presetWorkouts = userPresetWorkouts.map((userPresetWorkout) => userPresetWorkout.PresetWorkout);

        res.status(200).json(presetWorkouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    linkPresetWorkout,
    unlinkPresetWorkout,
    getUserPresetWorkouts
};