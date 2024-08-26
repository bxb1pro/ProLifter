const { PresetTemplate, PresetWorkout, PresetTemplatePresetWorkout } = require('../models');

// Link a preset workout to a preset template
const linkPresetWorkout = async (req, res) => {
    try {
        const { presetWorkoutID } = req.body;
        const presetTemplateID = req.params.id;

        // Check if the preset template exists
        const presetTemplate = await PresetTemplate.findByPk(presetTemplateID);
        if (!presetTemplate) {
            return res.status(404).json({ error: 'Preset template not found' });
        }

        // Check if the preset workout exists
        const presetWorkout = await PresetWorkout.findByPk(presetWorkoutID);
        if (!presetWorkout) {
            return res.status(404).json({ error: 'Preset workout not found' });
        }

        // Link the preset workout to the preset template
        await PresetTemplatePresetWorkout.create({ presetTemplateID, presetWorkoutID });

        res.status(200).json({ message: 'Preset workout linked to preset template successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Unlink a preset workout from a preset template
const unlinkPresetWorkout = async (req, res) => {
    try {
        const { presetWorkoutID } = req.body;
        const presetTemplateID = req.params.id;

        // Check if the link exists
        const link = await PresetTemplatePresetWorkout.findOne({
            where: { presetTemplateID, presetWorkoutID }
        });

        if (!link) {
            return res.status(404).json({ error: 'Link between preset template and preset workout not found' });
        }

        // Unlink the preset workout from the preset template
        await link.destroy();

        res.status(200).json({ message: 'Preset workout unlinked from preset template successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all preset workouts linked to a preset template
const getPresetWorkoutsForPresetTemplate = async (req, res) => {
    try {
        const presetTemplateID = req.params.id;

        // Check if the preset template exists
        const presetTemplate = await PresetTemplate.findByPk(presetTemplateID);
        if (!presetTemplate) {
            return res.status(404).json({ error: 'Preset template not found' });
        }

        // Fetch all preset workouts linked to this preset template
        const presetWorkouts = await PresetTemplatePresetWorkout.findAll({
            where: { presetTemplateID },
            include: [{ model: PresetWorkout }] // Include the PresetWorkout details
        });

        res.status(200).json(presetWorkouts);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    linkPresetWorkout,
    unlinkPresetWorkout,
    getPresetWorkoutsForPresetTemplate
};