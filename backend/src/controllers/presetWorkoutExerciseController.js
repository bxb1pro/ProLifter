const PresetWorkoutExercise = require('../models/presetWorkoutExercise');
const PresetWorkout = require('../models/presetWorkout');
const Exercise = require('../models/exercise');

const linkExercise = async (req, res) => {
    try {
        const { exerciseID } = req.body;
        const presetWorkoutID = req.params.id;

        // Make sure both preset workout and exercise exist
        const workout = await PresetWorkout.findByPk(presetWorkoutID);
        const exercise = await Exercise.findByPk(exerciseID);

        if (!workout || !exercise) {
            return res.status(404).json({ error: 'Preset workout or exercise not found' });
        }

        // Create link
        await PresetWorkoutExercise.create({ presetWorkoutID, exerciseID });

        res.status(200).json({ message: 'Exercise linked successfully' });
    } catch (error) {
        console.error(error);
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