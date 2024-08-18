const WorkoutLog = require('../models/workoutLog');

const startWorkout = async (req, res) => {
    try {
        const { userID, presetWorkoutID, customWorkoutID } = req.body;
        const newWorkoutLog = await WorkoutLog.create({ userID, presetWorkoutID, customWorkoutID });
        res.status(201).json(newWorkoutLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const finishWorkout = async (req, res) => {
    try {
        const workoutLog = await WorkoutLog.findByPk(req.params.id);
        if (!workoutLog) {
            return res.status(404).json({ error: 'Workout log not found' });
        }
        workoutLog.workoutLogCompleted = true;
        await workoutLog.save();
        res.status(200).json(workoutLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const editWorkoutLog = async (req, res) => {
    try {
        const { workoutLogDate, workoutLogCompleted } = req.body;
        const workoutLog = await WorkoutLog.findByPk(req.params.id);
        if (!workoutLog) {
            return res.status(404).json({ error: 'Workout log not found' });
        }
        workoutLog.workoutLogDate = workoutLogDate;
        workoutLog.workoutLogCompleted = workoutLogCompleted;
        await workoutLog.save();
        res.status(200).json(workoutLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteWorkoutLog = async (req, res) => {
    try {
        const workoutLog = await WorkoutLog.findByPk(req.params.id);
        if (!workoutLog) {
            return res.status(404).json({ error: 'Workout log not found' });
        }
        await workoutLog.destroy();
        res.status(200).json({ message: 'Workout log deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    startWorkout,
    finishWorkout,
    editWorkoutLog,
    deleteWorkoutLog,
};