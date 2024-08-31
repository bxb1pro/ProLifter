const { CustomWorkoutExercise, CustomWorkout, Exercise } = require('../models');
const { getExerciseById } = require('../services/exerciseService');

const linkExercise = async (req, res) => {
    try {
        const { exerciseID } = req.body;
        const customWorkoutID = req.params.id;

        console.log(`Linking exercise ID: ${exerciseID} to custom workout ID: ${customWorkoutID}`);

        // Make sure custom workout exists
        const workout = await CustomWorkout.findByPk(customWorkoutID);
        if (!workout) {
            console.log(`Custom workout with ID ${customWorkoutID} not found.`);
            return res.status(404).json({ error: 'Custom workout not found' });
        }

        // Check if the exercise is already linked to the preset workout
        const existingLink = await CustomWorkoutExercise.findOne({
            where: { customWorkoutID, exerciseID },
        });

        if (existingLink) {
            return res.status(409).json({ error: 'Exercise already linked to this workout' });
        }

        // Check if the exercise exists in the local database
        let exercise = await Exercise.findByPk(exerciseID);

        // If not, fetch it from the external API and store it locally
        if (!exercise) {
            const externalExercise = await getExerciseById(exerciseID);

            if (!externalExercise) {
                console.log(`Exercise with ID ${exerciseID} not found.`);
                return res.status(404).json({ error: 'Exercise not found' });
            }

            // Store the exercise in the local database
            exercise = await Exercise.create({
                exerciseID: externalExercise.id,
                exerciseName: externalExercise.name,
                exerciseBodypart: externalExercise.bodyPart,
                exerciseDescription: externalExercise.instructions,
                exerciseFormGuide: externalExercise.instructions.join(', '),
                exerciseImageUrl: externalExercise.gifUrl,
                exerciseEquipment: externalExercise.equipment,
                exerciseSecondaryBodypart: externalExercise.instructions.join(', ')
            });
        }

        // Create the link in the CustomWorkoutExercise table
        await CustomWorkoutExercise.create({ customWorkoutID, exerciseID: exercise.exerciseID });

        res.status(200).json({ message: 'Exercise linked successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const unlinkExercise = async (req, res) => {
    try {
        const { exerciseID } = req.body;
        const customWorkoutID = req.params.id;

        // Find the link before attempting to delete it
        const link = await CustomWorkoutExercise.findOne({ where: { customWorkoutID, exerciseID } });

        if (!link) {
            return res.status(404).json({ error: 'Link between custom workout and exercise not found' });
        }

        // Delete the link
        await link.destroy();

        res.status(200).json({ message: 'Exercise unlinked successfully', link });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getExercisesForCustomWorkout = async (req, res) => {
    try {
        const customWorkoutID = req.params.id;

        // Find all exercises linked to this custom workout
        const exercises = await CustomWorkoutExercise.findAll({
            where: { customWorkoutID },
            include: [Exercise], // Include the Exercise details
        });

        if (!exercises || exercises.length === 0) {
            return res.status(404).json({ error: 'No exercises found for this custom workout' });
        }

        res.status(200).json(exercises);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
    linkExercise,
    unlinkExercise,
    getExercisesForCustomWorkout
};