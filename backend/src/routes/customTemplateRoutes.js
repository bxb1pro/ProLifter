const express = require('express');
const { createTemplate, editTemplate, deleteTemplate, getUserCustomTemplates } = require('../controllers/customTemplateController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

// Create a new custom template
router.post('/', verifyRole(['user']), createTemplate);

// Edit an existing custom template
router.put('/:id/edit', verifyRole(['user']), editTemplate);

// Delete a custom template
router.delete('/:id/delete', verifyRole(['user']), deleteTemplate);

// Get all custom templates for the current user
router.get('/', verifyRole(['user']), getUserCustomTemplates);

module.exports = router;