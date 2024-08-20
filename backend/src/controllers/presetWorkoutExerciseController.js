const { PresetWorkout, PresetWorkoutExercise, Exercise } = require('../models');
const { getExerciseById } = require('../services/exerciseService');

const linkExercise = async (req, res) => {
    try {
        const { exerciseID } = req.body;  // External ID from API
        const presetWorkoutID = req.params.id;

        const workout = await PresetWorkout.findByPk(presetWorkoutID);
        if (!workout) {
            return res.status(404).json({ error: 'Preset workout not found' });
        }

        // Check if exercise exists locally in DB, if not then fetch and create from external API
        let exercise = await Exercise.findByPk(exerciseID);
        if (!exercise) {
            try {
                const exerciseData = await getExerciseById(exerciseID);
                if (!exerciseData) {
                    return res.status(404).json({ error: 'Exercise not found in external API' });
                }
                
                // Create exercise locally
                exercise = await Exercise.create({
                    exerciseID: exerciseData.id,
                    exerciseName: exerciseData.name,
                    exerciseBodypart: exerciseData.bodyPart,
                    exerciseDescription: exerciseData.instructions.join(', '),
                    exerciseFormGuide: exerciseData.instructions.join(', '),
                    exerciseImageUrl: exerciseData.gifUrl,
                    exerciseEquipment: exerciseData.equipment,
                    exerciseSecondaryBodypart: externalExercise.secondaryMuscles,
                });
            } catch (error) {
                console.error(`Failed to fetch exercise with ID ${exerciseID} from external API:`, error);
                return res.status(500).json({ error: 'Failed to fetch exercise from external API' });
            }
        }

        // Create link in the database
        await PresetWorkoutExercise.create({ presetWorkoutID, exerciseID });

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