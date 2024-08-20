const { PresetWorkout, PresetWorkoutExercise, Exercise } = require('../models');
const { getExerciseById } = require('../services/exerciseService');

const linkExercise = async (req, res) => {
    try {
        const { exerciseID } = req.body; // This is the external ID from the API
        const presetWorkoutID = req.params.id;

        console.log(`Linking exercise ID: ${exerciseID} to preset workout ID: ${presetWorkoutID}`);

        // Check if the preset workout exists
        const workout = await PresetWorkout.findByPk(presetWorkoutID);
        if (!workout) {
            return res.status(404).json({ error: 'Preset workout not found' });
        }

        // Check if the exercise exists in the local database
        let exercise = await Exercise.findByPk(exerciseID);

        // If not, fetch it from the external API and store it locally
        if (!exercise) {
            const externalExercise = await getExerciseById(exerciseID);

            if (!externalExercise) {
                console.log(`Exercise with ID ${exerciseID} not found in external API.`);
                return res.status(404).json({ error: 'Exercise not found in external API' });
            }

            // Store the exercise in the local database
            exercise = await Exercise.create({
                exerciseID: externalExercise.id,
                exerciseName: externalExercise.name,
                exerciseBodypart: externalExercise.bodyPart,
                exerciseDescription: externalExercise.instructions.join(', '),
                exerciseFormGuide: externalExercise.instructions.join(', '),
                exerciseImageUrl: externalExercise.gifUrl,
                exerciseEquipment: externalExercise.equipment,
                exerciseSecondaryBodypart: externalExercise.secondaryMuscles.join(', '),
            });
        }

        // Create the link in the PresetWorkoutExercise table
        await PresetWorkoutExercise.create({ presetWorkoutID, exerciseID: exercise.exerciseID });

        res.status(200).json({ message: 'Exercise linked successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const unlinkExercise = async (req, res) => {
    try {
        const { exerciseID } = req.body;
        const presetWorkoutID = req.params.id;

        // Check if the preset workout exists
        const workout = await PresetWorkout.findByPk(presetWorkoutID);
        if (!workout) {
            return res.status(404).json({ error: 'Preset workout not found' });
        }

        // Check if the exercise exists in the local database
        const exercise = await Exercise.findByPk(exerciseID);
        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        // Check if the link exists before attempting to delete it
        const link = await PresetWorkoutExercise.findOne({ where: { presetWorkoutID, exerciseID } });
        if (!link) {
            return res.status(404).json({ error: 'Link between preset workout and exercise not found' });
        }

        // Find link and delete
        await link.destroy();

        res.status(200).json({ message: 'Exercise unlinked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    linkExercise,
    unlinkExercise,
};