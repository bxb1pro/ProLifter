const UserPresetWorkout = require('../models/userPresetWorkout');
const PresetWorkout = require('../models/presetWorkout');
const User = require('../models/user');

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

        // Create the link with the current date
        await UserPresetWorkout.create({
            userID,
            presetWorkoutID,
            dateSelected: new Date(), // Set the current date and time
        });

        res.status(200).json({ message: 'Preset workout linked to user successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

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

module.exports = {
    linkPresetWorkout,
    unlinkPresetWorkout,
};