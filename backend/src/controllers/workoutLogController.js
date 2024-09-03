const { WorkoutLog, PresetWorkoutExercise, CustomWorkoutExercise, ExerciseLog, SetLog, Exercise } = require('../models');

// Start a workout
const startWorkout = async (req, res) => {
    try {
        const userID = req.user.userID;  // Extract userID from the authenticated user's JWT
        const { presetWorkoutID, customWorkoutID } = req.body;

        // Create workout log
        const newWorkoutLog = await WorkoutLog.create({
            userID,
            presetWorkoutID,
            customWorkoutID
        });

        // Logic for preset workout
        if (presetWorkoutID) {
            const presetExercises = await PresetWorkoutExercise.findAll({
                where: { presetWorkoutID },
                include: [Exercise]  // Include exercise details
            });

            for (const presetExercise of presetExercises) {
                // Create an exercise log for each exercise of the preset workout and fill with default values
                const exerciseLog = await ExerciseLog.create({
                    userID,
                    workoutLogID: newWorkoutLog.workoutLogID,
                    exerciseID: presetExercise.exerciseID,
                    exerciseLogSets: presetExercise.defaultSets
                });

                // Create set logs for each set of each exercise of the preset workout and fill with default values
                for (let i = 0; i < presetExercise.defaultSets; i++) {
                    await SetLog.create({
                        exerciseLogID: exerciseLog.exerciseLogID,
                        setLogReps: presetExercise.defaultReps,
                        setLogRPE: presetExercise.defaultRPE
                    });
                }
            }
        }

        // Logic for custom workout
        if (customWorkoutID) {
            const customExercises = await CustomWorkoutExercise.findAll({
                where: { customWorkoutID },
                include: [Exercise]  // Include exercise details
            });

            for (const customExercise of customExercises) {
                // Create an exercise log for each exercise of the custom workout (no defaults because user fills data for custom later)
                await ExerciseLog.create({
                    userID,
                    workoutLogID: newWorkoutLog.workoutLogID,
                    exerciseID: customExercise.exerciseID,
                    exerciseLogSets: null // Null sets to leave for user to fill
                });
            }
        }

        res.status(201).json(newWorkoutLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Finish a workout
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

// Edit a workout log
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

// Delete a workout log
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

// Get workout logs for a user
const getUserWorkoutLogs = async (req, res) => {
    try {
        // Extract the userID from authenticated user
        const userID = req.user.userID;

        // Find all workout logs associated with the user
        const workoutLogs = await WorkoutLog.findAll({
            where: { userID },
            order: [['workoutLogDate', 'DESC']],
        });

        res.status(200).json(workoutLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get workout log details
const getWorkoutLogDetails = async (req, res) => {
    try {
        const workoutLogID = req.params.id;

        // Find the workout log by ID and include related ExerciseLogs, Exercises, and SetLogs
        const workoutLog = await WorkoutLog.findByPk(workoutLogID, {
            include: [{
                model: ExerciseLog,
                include: [
                    {
                        model: SetLog,
                        attributes: ['setLogID', 'setLogWeight', 'setLogReps', 'setLogRPE', 'setLog1RM']
                    },
                    {
                        model: Exercise,
                        attributes: ['exerciseName', 'exerciseBodypart', 'exerciseDescription', 'exerciseImageUrl', 'exerciseEquipment', 'exerciseSecondaryBodypart']
                    }
                ],
                attributes: ['exerciseLogID', 'exerciseID', 'exerciseLogSets', 'exerciseLogCompleted']
            }],
            attributes: ['workoutLogID', 'workoutLogDate', 'workoutLogCompleted']
        });

        if (!workoutLog) {
            return res.status(404).json({ error: 'Workout log not found' });
        }

        res.status(200).json(workoutLog);
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
    getUserWorkoutLogs,
    getWorkoutLogDetails
};
