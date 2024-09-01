const express = require('express');
const { getAllUsers, getUserById, createUser } = require('../controllers/userController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

//router.get('/', getAllUsers);  --  used for testing

// Get a specific user
router.get('/:id', getUserById);

// Create a user
router.post('/', createUser);

//Allow only admins and superadmins to fetch all exercises
router.get('/', verifyRole(['admin', 'superadmin']), getAllUsers);

module.exports = router;