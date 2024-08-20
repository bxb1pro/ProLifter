const { CustomWorkout } = require('../models');

// Create a new custom workout
const createWorkout = async (req, res) => {
    try {
        const { customWorkoutName, customWorkoutDays } = req.body;

        // Extract the userID from the authenticated user's request
        const userID = req.user.userID;

        const newWorkout = await CustomWorkout.create({
            customWorkoutName,
            customWorkoutDays,
            userID, // Use the userID extracted from the JWT
        });

        res.status(201).json({ message: 'Custom workout created successfully', customWorkoutID: newWorkout.customWorkoutID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const viewWorkout = async (req, res) => {
    try {
        const workout = await CustomWorkout.findByPk(req.params.id);
        if (!workout) {
            return res.status(404).json({ error: 'Custom workout not found' });
        }
        res.status(200).json(workout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const editWorkout = async (req, res) => {
    try {
        const { customWorkoutName, customWorkoutDays } = req.body;
        const workout = await CustomWorkout.findByPk(req.params.id);
        if (!workout) {
            return res.status(404).json({ error: 'Custom workout not found' });
        }
        workout.customWorkoutName = customWorkoutName;
        workout.customWorkoutDays = customWorkoutDays;
        await workout.save();
        res.status(200).json(workout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteWorkout = async (req, res) => {
    try {
        const workout = await CustomWorkout.findByPk(req.params.id);
        if (!workout) {
            return res.status(404).json({ error: 'Custom workout not found' });
        }
        await workout.destroy();
        res.status(200).json({ message: 'Custom workout deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createWorkout,
    viewWorkout,
    editWorkout,
    deleteWorkout,
};