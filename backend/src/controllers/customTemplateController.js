const { CustomTemplate } = require('../models');

// Create a new custom template
const createTemplate = async (req, res) => {
    try {
        const { customTemplateName, customTemplateDays } = req.body;
        const userID = req.user.userID;

        const newTemplate = await CustomTemplate.create({
            customTemplateName,
            customTemplateDays,
            userID
        });

        res.status(201).json(newTemplate);
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Edit an existing custom template
const editTemplate = async (req, res) => {
    try {
        const { customTemplateName, customTemplateDays } = req.body;
        const customTemplateID = req.params.id;

        const template = await CustomTemplate.findByPk(customTemplateID);

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        // Ensure the template belongs to the user
        if (template.userID !== req.user.userID) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        template.customTemplateName = customTemplateName || template.customTemplateName;
        template.customTemplateDays = customTemplateDays || template.customTemplateDays;

        await template.save();

        res.status(200).json(template);
    } catch (error) {
        console.error('Error editing template:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a custom template
const deleteTemplate = async (req, res) => {
    try {
        const customTemplateID = req.params.id;

        const template = await CustomTemplate.findByPk(customTemplateID);

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        // Ensure the template belongs to the user
        if (template.userID !== req.user.userID) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await template.destroy();

        res.status(200).json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all custom templates for the current user
const getUserCustomTemplates = async (req, res) => {
    try {
        const userID = req.user.userID;

        const customTemplates = await CustomTemplate.findAll({
            where: { userID },
            order: [['customTemplateDateCreated', 'DESC']],
        });

        res.status(200).json(customTemplates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createTemplate,
    editTemplate,
    deleteTemplate,
    getUserCustomTemplates,
};
