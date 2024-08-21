const express = require('express');
const { signup, login, logout, deleteAccount, getAccountDetails } = require('../controllers/authController');
const verifyRole = require('../middleware/roleMiddleware'); 

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/delete', verifyRole(['user', 'admin']), deleteAccount);
router.get('/account', verifyRole(['user', 'admin']), getAccountDetails);

module.exports = router;