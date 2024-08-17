const ExerciseLog = require('../models/exerciseLog');

const logSet = async (req, res) => {
    try {
        const { sets } = req.body;
        const exerciseLog = await ExerciseLog.findByPk(req.params.id);
        if (!exerciseLog) {
            return res.status(404).json({ error: 'Exercise log not found' });
        }
        exerciseLog.exerciseLogSets = sets;
        await exerciseLog.save();
        res.status(200).json(exerciseLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const logReps = async (req, res) => {
    try {
        const { reps } = req.body;
        const exerciseLog = await ExerciseLog.findByPk(req.params.id);
        if (!exerciseLog) {
            return res.status(404).json({ error: 'Exercise log not found' });
        }
        exerciseLog.exerciseLogReps = reps;
        await exerciseLog.save();
        res.status(200).json(exerciseLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const logRPE = async (req, res) => {
    try {
        const { rpe } = req.body;
        const exerciseLog = await ExerciseLog.findByPk(req.params.id);
        if (!exerciseLog) {
            return res.status(404).json({ error: 'Exercise log not found' });
        }
        exerciseLog.exerciseLogRPE = rpe;
        await exerciseLog.save();
        res.status(200).json(exerciseLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const logOneRepMax = async (req, res) => {
    try {
        const { oneRepMax } = req.body;
        const exerciseLog = await ExerciseLog.findByPk(req.params.id);
        if (!exerciseLog) {
            return res.status(404).json({ error: 'Exercise log not found' });
        }
        exerciseLog.exerciseLog1RM = oneRepMax;
        await exerciseLog.save();
        res.status(200).json(exerciseLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    logSet,
    logReps,
    logRPE,
    logOneRepMax,
};