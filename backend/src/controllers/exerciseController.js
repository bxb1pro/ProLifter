const Exercise = require('../models/exercise');

const fetchExerciseDetails = async (req, res) => {
    try {
        const exercise = await Exercise.findByPk(req.params.id);
        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }
        res.status(200).json(exercise);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// const suggestRPE = async (req, res) => {
//     try {
//         // Example logic to suggest RPE
//         const { exerciseID } = req.params;
//         const exercise = await Exercise.findByPk(exerciseID);
//         if (!exercise) {
//             return res.status(404).json({ error: 'Exercise not found' });
//         }
//         // Example to be replaced with actual logic
//         const suggestedRPE = Math.random() * 10;
//         res.status(200).json({ suggestedRPE });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

module.exports = {
    fetchExerciseDetails,
    //suggestRPE,
};