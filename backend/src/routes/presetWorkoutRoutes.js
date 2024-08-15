const express = require('express');
const { viewDetails, addToUser } = require('../controllers/presetWorkoutController');

const router = express.Router();

router.get('/:id', viewDetails);
// router.post('/:id/add-to-user', addToUser);

module.exports = router;