const CustomWorkoutExercise = require('../models/customWorkoutExercise');
const CustomWorkout = require('../models/customWorkout');
const Exercise = require('../models/exercise');

const linkExercise = async (req, res) => {
    try {
        const { exerciseID } = req.body;
        const customWorkoutID = req.params.id;

        // Make sure custom workout and exercise exist
        const workout = await CustomWorkout.findByPk(customWorkoutID);
        const exercise = await Exercise.findByPk(exerciseID);

        if (!workout || !exercise) {
            return res.status(404).json({ error: 'Custom workout or exercise not found' });
        }

        // Create link
        await CustomWorkoutExercise.create({ customWorkoutID, exerciseID });

        res.status(200).json({ message: 'Exercise linked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const unlinkExercise = async (req, res) => {
    try {
        const { exerciseID } = req.body;
        const customWorkoutID = req.params.id;

        // Find the link and delete
        await CustomWorkoutExercise.destroy({ where: { customWorkoutID, exerciseID } });

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