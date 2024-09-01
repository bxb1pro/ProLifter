const { ExerciseLog, WorkoutLog } = require('../models');

// Start an exercise log
const startExerciseLog = async (req, res) => {
    try {
        const { userID, workoutLogID, exerciseID } = req.body;

        // Make sure the parent workout log exists
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

// Get exercise logs for a specific user's specific workout
const getUserExerciseLogsByWorkout = async (req, res) => {
    try {
        const userID = req.user.userID; // Extract user ID from the JWT token
        const { workoutLogID } = req.params;

        // Ensure the workout log belongs to the user
        const workoutLog = await WorkoutLog.findOne({
            where: {
                workoutLogID,
                userID,
            },
        });

        if (!workoutLog) {
            return res.status(404).json({ error: 'Workout log not found or does not belong to the user.' });
        }

        // Fetch all exercise logs associated with this workout log and user
        const exerciseLogs = await ExerciseLog.findAll({
            where: {
                workoutLogID,
                userID,
            },
            order: [['createdAt', 'ASC']],
        });

        res.status(200).json(exerciseLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete an exercise log
const deleteExerciseLog = async (req, res) => {
    try {
        const exerciseLog = await ExerciseLog.findByPk(req.params.id);

        if (!exerciseLog) {
            return res.status(404).json({ error: 'Exercise log not found' });
        }

        await exerciseLog.destroy();

        res.status(200).json({ message: 'Exercise log deleted successfully', exerciseLogID: exerciseLog.exerciseLogID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    startExerciseLog,
    editExerciseLog,
    finishExerciseLog,
    getUserExerciseLogsByWorkout,
    deleteExerciseLog,
};
