const PresetWorkout = require('../models/presetWorkout');

const viewDetails = async (req, res) => {
    try {
        const workout = await PresetWorkout.findByPk(req.params.id);
        if (!workout) {
            return res.status(404).json({ error: 'Preset workout not found' });
        }
        res.status(200).json(workout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// const addToUser = async (req, res) => {
//     try {
//         const { userID } = req.body;
//         const workout = await PresetWorkout.findByPk(req.params.id);
//         if (!workout) {
//             return res.status(404).json({ error: 'Preset workout not found' });
//         }
//         // Logic to add the preset workout to a user should be implemented here
//         // This might involve creating a new entry in a join table (e.g., UserPresetWorkout)
//         res.status(200).json({ message: 'Preset workout added to user successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

module.exports = {
    viewDetails,
    //addToUser,
};