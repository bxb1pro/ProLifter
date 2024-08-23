const { WorkoutLog, PresetWorkoutExercise, CustomWorkoutExercise, ExerciseLog, SetLog, Exercise } = require('../models');

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
                // Create an exercise log for each exercise of the custom workout
                // Note: The user is expected to provide the sets, reps, and RPE later
                await ExerciseLog.create({
                    userID,
                    workoutLogID: newWorkoutLog.workoutLogID,
                    exerciseID: customExercise.exerciseID,
                    exerciseLogSets: null // Sets will be added by the user later
                });

                // No SetLogs are created here because the user will set these manually
            }
        }

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

const getUserWorkoutLogs = async (req, res) => {
    try {
        // Extract the userID from the authenticated user's request
        const userID = req.user.userID;

        // Find all workout logs associated with this user
        const workoutLogs = await WorkoutLog.findAll({
            where: { userID },
            order: [['workoutLogDate', 'DESC']], // Optional: order by date
        });

        res.status(200).json(workoutLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getWorkoutLogDetails = async (req, res) => {
    try {
        const workoutLogID = req.params.id;

        // Find the workout log by ID and include related ExerciseLogs and SetLogs
        const workoutLog = await WorkoutLog.findByPk(workoutLogID, {
            include: [{
                model: ExerciseLog,
                include: [
                    {
                        model: SetLog,
                        attributes: ['setLogID', 'setLogWeight', 'setLogReps', 'setLogRPE', 'setLog1RM'] // Include setLogID and other necessary attributes
                    },
                    {
                        model: Exercise, // Include exercise details
                        attributes: ['exerciseName', 'exerciseBodypart']
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
