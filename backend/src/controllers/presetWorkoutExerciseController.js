const PresetWorkoutExercise = require('../models/presetWorkoutExercise');
const PresetWorkout = require('../models/presetWorkout');
const Exercise = require('../models/exercise');

const linkExercise = async (req, res) => {
    try {
        const { exerciseID } = req.body;  // This is the external ID from the API
        const presetWorkoutID = req.params.id;

        // Check if the preset workout exists
        const workout = await PresetWorkout.findByPk(presetWorkoutID);
        if (!workout) {
            return res.status(404).json({ error: 'Preset workout not found' });
        }

        // Optionally verify exercise existence in the external API
        try {
            const exerciseData = await getExerciseById(exerciseID);
            if (!exerciseData) {
                return res.status(404).json({ error: 'Exercise not found in external API' });
            }
        } catch (error) {
            console.error(`Failed to fetch exercise with ID ${exerciseID} from external API:`, error);
            return res.status(500).json({ error: 'Failed to fetch exercise from external API' });
        }

        // Directly create the link in the database
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

        // Find link and delete
        await PresetWorkoutExercise.destroy({ where: { presetWorkoutID, exerciseID } });

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