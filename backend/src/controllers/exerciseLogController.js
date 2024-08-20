const { ExerciseLog } = require('../models');

// Start an exercise log
const startExerciseLog = async (req, res) => {
    try {
        const { userID, workoutLogID, exerciseID } = req.body;

        // Ensure the parent workout log exists
        const workoutLog = await WorkoutLog.findByPk(workoutLogID);
        if (!workoutLog) {
            return res.status(404).json({ error: 'Workout log not found' });
        }

        const newExerciseLog = await ExerciseLog.create({
            userID,
            workoutLogID,
            exerciseID,
        });

        res.status(201).json(newExerciseLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Edit an exercise log
const editExerciseLog = async (req, res) => {
    try {
        const { exerciseLogSets, exerciseLogCompleted } = req.body;
        const exerciseLog = await ExerciseLog.findByPk(req.params.id);

        if (!exerciseLog) {
            return res.status(404).json({ error: 'Exercise log not found' });
        }

        if (exerciseLog.exerciseLogCompleted) {
            return res.status(400).json({ error: 'Cannot edit a completed exercise log.' });
        }

        exerciseLog.exerciseLogSets = exerciseLogSets || exerciseLog.exerciseLogSets;
        exerciseLog.exerciseLogCompleted = exerciseLogCompleted || exerciseLog.exerciseLogCompleted;

        await exerciseLog.save();

        res.status(200).json(exerciseLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Finish an exercise log
const finishExerciseLog = async (req, res) => {
    try {
        const exerciseLog = await ExerciseLog.findByPk(req.params.id);

        if (!exerciseLog) {
            return res.status(404).json({ error: 'Exercise log not found' });
        }

        exerciseLog.exerciseLogCompleted = true;

        await exerciseLog.save();

        res.status(200).json(exerciseLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    startExerciseLog,
    editExerciseLog,
    finishExerciseLog,
};