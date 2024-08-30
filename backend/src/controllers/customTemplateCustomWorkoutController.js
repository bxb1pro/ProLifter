const { CustomTemplate, CustomWorkout, CustomTemplateCustomWorkout } = require('../models');

// Link a custom workout to a custom template
const linkWorkout = async (req, res) => {
    try {
        const { customWorkoutID } = req.body;
        const customTemplateID = req.params.id;

        // Check if the custom template exists
        const customTemplate = await CustomTemplate.findByPk(customTemplateID);
        if (!customTemplate) {
            return res.status(404).json({ error: 'Custom template not found' });
        }

        // Check if the custom workout exists
        const customWorkout = await CustomWorkout.findByPk(customWorkoutID);
        if (!customWorkout) {
            return res.status(404).json({ error: 'Custom workout not found' });
        }

        // Check if the custom workout is already linked to the custom template
        const existingLink = await CustomTemplateCustomWorkout.findOne({
            where: { customTemplateID, customWorkoutID }
        });

        if (existingLink) {
            return res.status(409).json({ error: 'Custom workout is already linked to this template' });
        }

        // Link the custom workout to the custom template
        await CustomTemplateCustomWorkout.create({ customTemplateID, customWorkoutID });

        res.status(200).json({ message: 'Custom workout linked to custom template successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Unlink a custom workout from a custom template
const unlinkWorkout = async (req, res) => {
    try {
        const { customWorkoutID } = req.body;
        const customTemplateID = req.params.id;

        // Check if the link exists
        const link = await CustomTemplateCustomWorkout.findOne({
            where: { customTemplateID, customWorkoutID }
        });

        if (!link) {
            return res.status(404).json({ error: 'Link between custom template and workout not found' });
        }

        // Unlink the custom workout from the custom template
        await link.destroy();

        res.status(200).json({ message: 'Custom workout unlinked from custom template successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all custom workouts linked to a custom template
const getCustomWorkoutsForCustomTemplate = async (req, res) => {
    try {
        const customTemplateID = req.params.id;

        // Check if the custom template exists
        const customTemplate = await CustomTemplate.findByPk(customTemplateID);
        if (!customTemplate) {
            return res.status(404).json({ error: 'Custom template not found' });
        }

        // Fetch all custom workouts linked to this custom template
        const customWorkouts = await CustomTemplateCustomWorkout.findAll({
            where: { customTemplateID },
            include: [{ model: CustomWorkout }] // Include the CustomWorkout details
        });

        res.status(200).json(customWorkouts);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    linkWorkout,
    unlinkWorkout,
    getCustomWorkoutsForCustomTemplate
};