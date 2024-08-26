const express = require('express');
const { createTemplate, editTemplate, deleteTemplate, getPresetTemplates, viewPresetTemplateDetails } = require('../controllers/presetTemplateController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

// Route to view all preset templates
router.get('/', getPresetTemplates);

// Anyone can view preset template details
router.get('/:id', viewPresetTemplateDetails);

// Only admin and superadmin can create, edit, or delete preset templates
router.post('/', verifyRole(['admin', 'superadmin']), createTemplate);
router.put('/:id', verifyRole(['admin', 'superadmin']), editTemplate);
router.delete('/:id', verifyRole(['admin', 'superadmin']), deleteTemplate);

module.exports = router;