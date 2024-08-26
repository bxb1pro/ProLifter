const { PresetTemplate } = require('../models');

// Create a new preset template
const createTemplate = async (req, res) => {
    try {
        const { presetTemplateName, presetTemplateDays } = req.body;

        const newTemplate = await PresetTemplate.create({
            presetTemplateName,
            presetTemplateDays
        });

        res.status(201).json(newTemplate);
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Edit an existing preset template
const editTemplate = async (req, res) => {
    try {
        const { presetTemplateName, presetTemplateDays } = req.body;
        const presetTemplateID = req.params.id;

        const template = await PresetTemplate.findByPk(presetTemplateID);

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        template.presetTemplateName = presetTemplateName || template.presetTemplateName;
        template.presetTemplateDays = presetTemplateDays || template.presetTemplateDays;

        await template.save();

        res.status(200).json(template);
    } catch (error) {
        console.error('Error editing template:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a preset template
const deleteTemplate = async (req, res) => {
    try {
        const presetTemplateID = req.params.id;

        const template = await PresetTemplate.findByPk(presetTemplateID);

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        await template.destroy();

        res.status(200).json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all preset templates (for anyone to view)
const getPresetTemplates = async (req, res) => {
    try {
        const presetTemplates = await PresetTemplate.findAll({
            order: [['presetTemplateDateCreated', 'DESC']],
        });

        res.status(200).json(presetTemplates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// View details of a specific preset template
const viewPresetTemplateDetails = async (req, res) => {
    try {
        const presetTemplateID = req.params.id;
        const template = await PresetTemplate.findByPk(presetTemplateID);

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.status(200).json(template);
    } catch (error) {
        console.error('Error fetching template details:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createTemplate,
    editTemplate,
    deleteTemplate,
    getPresetTemplates,
    viewPresetTemplateDetails,
};