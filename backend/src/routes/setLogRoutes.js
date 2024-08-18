const express = require('express');
const {addSetLog, editSetLog, deleteSetLog} = require('../controllers/setLogController');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', verifyRole(['user']), addSetLog);
router.put('/:id/edit', verifyRole(['user']), editSetLog);
router.delete('/:id/delete', verifyRole(['user']), deleteSetLog);

module.exports = router;
