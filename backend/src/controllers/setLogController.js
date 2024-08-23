const { SetLog, ExerciseLog, WorkoutLog } = require('../models');

// Add a new set log
const addSetLog = async (req, res) => {
    try {
        const { setLogWeight, setLogReps, setLogRPE, setLog1RM, exerciseLogID } = req.body;

        const newSetLog = await SetLog.create({
            setLogWeight,
            setLogReps,
            setLogRPE,
            setLog1RM,
            exerciseLogID
        });

        res.status(201).json(newSetLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Edit an existing set log
const editSetLog = async (req, res) => {
    try {
        const { setLogWeight, setLogReps, setLogRPE, setLog1RM } = req.body;
        const setLog = await SetLog.findByPk(req.params.id);

        if (!setLog) {
            return res.status(404).json({ error: 'Set log not found' });
        }

        setLog.setLogWeight = setLogWeight || setLog.setLogWeight;
        setLog.setLogReps = setLogReps || setLog.setLogReps;
        setLog.setLogRPE = setLogRPE || setLog.setLogRPE;
        setLog.setLog1RM = setLog1RM || setLog.setLog1RM;

        await setLog.save();

        res.status(200).json(setLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a set log
const deleteSetLog = async (req, res) => {
    try {
        const setLog = await SetLog.findByPk(req.params.id);

        if (!setLog) {
            return res.status(404).json({ error: 'Set log not found' });
        }

        await setLog.destroy();

        res.status(200).json({ message: 'Set log deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getUserSetLogsByExercise = async (req, res) => {
    try {
        const userID = req.user.userID; // Extract user ID from the JWT token
        const { exerciseLogID } = req.params; // Get exerciseLogID from the URL parameters

        // Ensure the exercise log belongs to the user
        const exerciseLog = await ExerciseLog.findOne({
            where: {
                exerciseLogID,
                userID,
            },
            include: [{
                model: WorkoutLog,
                where: { userID }
            }]
        });

        if (!exerciseLog) {
            return res.status(404).json({ error: 'Exercise log not found or does not belong to the user.' });
        }

        // Fetch all set logs associated with this exercise log
        const setLogs = await SetLog.findAll({
            where: {
                exerciseLogID,
            },
            order: [['createdAt', 'ASC']], // Optional: order by creation time
        });

        res.status(200).json(setLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    addSetLog,
    editSetLog,
    deleteSetLog,
    getUserSetLogsByExercise,
};