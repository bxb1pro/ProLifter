const express = require('express');
const {
    logSet,
    logReps,
    logRPE,
    logOneRepMax,
} = require('../controllers/exerciseLogController');

const router = express.Router();

router.put('/:id/log-set', logSet);
router.put('/:id/log-reps', logReps);
router.put('/:id/log-rpe', logRPE);
router.put('/:id/log-one-rep-max', logOneRepMax);

module.exports = router;