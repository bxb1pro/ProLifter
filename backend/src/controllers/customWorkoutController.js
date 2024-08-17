const CustomWorkout = require('../models/customWorkout');

// const addExercise = async (req, res) => {
//     try {
//         const { exerciseID } = req.body;
//         const workout = await CustomWorkout.findByPk(req.params.id);
//         if (!workout) {
//             return res.status(404).json({ error: 'Custom workout not found' });
//         }
//         // Logic to add the exercise to the custom workout goes here
//         // This might involve updating a join table (e.g., CustomWorkoutExercise)
//         res.status(200).json({ message: 'Exercise added successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// const removeExercise = async (req, res) => {
//     try {
//         const { exerciseID } = req.body;
//         const workout = await CustomWorkout.findByPk(req.params.id);
//         if (!workout) {
//             return res.status(404).json({ error: 'Custom workout not found' });
//         }
//         // Logic to remove the exercise from the custom workout goes here
//         res.status(200).json({ message: 'Exercise removed successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

const editWorkout = async (req, res) => {
    try {
        const { customWorkoutName, customWorkoutDays } = req.body;
        const workout = await CustomWorkout.findByPk(req.params.id);
        if (!workout) {
            return res.status(404).json({ error: 'Custom workout not found' });
        }
        workout.customWorkoutName = customWorkoutName;
        workout.customWorkoutDays = customWorkoutDays;
        await workout.save();
        res.status(200).json(workout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteWorkout = async (req, res) => {
    try {
        const workout = await CustomWorkout.findByPk(req.params.id);
        if (!workout) {
            return res.status(404).json({ error: 'Custom workout not found' });
        }
        await workout.destroy();
        res.status(200).json({ message: 'Custom workout deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    //addExercise,
    //removeExercise,
    editWorkout,
    deleteWorkout,
};