const { UserPresetTemplate, PresetTemplate, User } = require('../models');

// Link a preset template to a user
const linkPresetTemplate = async (req, res) => {
    try {
        const { presetTemplateID } = req.body;
        const userID = req.params.id;

        // Make sure both user and preset template exist
        const user = await User.findByPk(userID);
        const template = await PresetTemplate.findByPk(presetTemplateID);

        if (!user || !template) {
            return res.status(404).json({ error: 'User or preset template not found' });
        }

        // Check if the preset template is already linked to the user
        const existingLink = await UserPresetTemplate.findOne({
            where: { userID, presetTemplateID }
        });

        if (existingLink) {
            return res.status(409).json({ error: 'Preset template is already linked to this user' });
        }

        // Create the link with the current date
        await UserPresetTemplate.create({
            userID,
            presetTemplateID,
            dateSelected: new Date(),
        });

        res.status(200).json({ message: 'Preset template linked to user successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Unlink a preset template from a user
const unlinkPresetTemplate = async (req, res) => {
    try {
        const { presetTemplateID } = req.body;
        const userID = req.params.id;

        // Find and delete link
        await UserPresetTemplate.destroy({ where: { userID, presetTemplateID } });

        res.status(200).json({ message: 'Preset template unlinked from user successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all preset templates linked to a user
const getUserPresetTemplates = async (req, res) => {
    try {
        const userID = req.params.id;

        // Fetch all preset templates linked to the user
        const userPresetTemplates = await UserPresetTemplate.findAll({
            where: { userID },
            include: [{ model: PresetTemplate }] // Include the PresetTemplate model to get template details
        });

        // Return empty array instead of 404 (bug fix for frontend)
        if (!userPresetTemplates || userPresetTemplates.length === 0) {
            return res.status(200).json([]);
        }

        // Extract the preset templates from the linked data
        const presetTemplates = userPresetTemplates.map((userPresetTemplate) => userPresetTemplate.PresetTemplate);

        res.status(200).json(presetTemplates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    linkPresetTemplate,
    unlinkPresetTemplate,
    getUserPresetTemplates
};