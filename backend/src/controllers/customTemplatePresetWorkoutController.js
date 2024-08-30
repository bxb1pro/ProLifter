const { CustomTemplate, PresetWorkout, CustomTemplatePresetWorkout } = require('../models');

// Link a preset workout to a custom template
const linkPresetWorkout = async (req, res) => {
    try {
        const { presetWorkoutID } = req.body;
        const customTemplateID = req.params.id;

        // Check if the custom template exists
        const customTemplate = await CustomTemplate.findByPk(customTemplateID);
        if (!customTemplate) {
            return res.status(404).json({ error: 'Custom template not found' });
        }

        // Check if the preset workout exists
        const presetWorkout = await PresetWorkout.findByPk(presetWorkoutID);
        if (!presetWorkout) {
            return res.status(404).json({ error: 'Preset workout not found' });
        }

        // Check if the link already exists
        const existingLink = await CustomTemplatePresetWorkout.findOne({
            where: { customTemplateID, presetWorkoutID }
        });

        if (existingLink) {
            return res.status(409).json({ error: 'Preset workout is already linked to this custom template' });
        }

        // Link the preset workout to the custom template
        await CustomTemplatePresetWorkout.create({ customTemplateID, presetWorkoutID });

        res.status(200).json({ message: 'Preset workout linked to custom template successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Unlink a preset workout from a custom template
const unlinkPresetWorkout = async (req, res) => {
    try {
        const { presetWorkoutID } = req.body;
        const customTemplateID = req.params.id;

        // Check if the link exists
        const link = await CustomTemplatePresetWorkout.findOne({
            where: { customTemplateID, presetWorkoutID }
        });

        if (!link) {
            return res.status(404).json({ error: 'Link between custom template and preset workout not found' });
        }

        // Unlink the preset workout from the custom template
        await link.destroy();

        res.status(200).json({ message: 'Preset workout unlinked from custom template successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all preset workouts linked to a custom template
const getPresetWorkoutsForCustomTemplate = async (req, res) => {
    try {
        const customTemplateID = req.params.id;

        // Check if the custom template exists
        const customTemplate = await CustomTemplate.findByPk(customTemplateID);
        if (!customTemplate) {
            return res.status(404).json({ error: 'Custom template not found' });
        }

        // Fetch all preset workouts linked to this custom template
        const presetWorkouts = await CustomTemplatePresetWorkout.findAll({
            where: { customTemplateID },
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
    getPresetWorkoutsForCustomTemplate
};