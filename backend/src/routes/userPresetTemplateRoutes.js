const express = require('express');
const { linkPresetTemplate, unlinkPresetTemplate, getUserPresetTemplates } = require('../controllers/userPresetTemplateController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

// Link a preset template to a user
router.post('/:id/link-preset-template', verifyRole(['user']), linkPresetTemplate);

// Unlink a preset template from a user
router.post('/:id/unlink-preset-template', verifyRole(['user']), unlinkPresetTemplate);

// Get all preset templates linked to a user
router.get('/:id/preset-templates', verifyRole(['user']), getUserPresetTemplates);

module.exports = router;