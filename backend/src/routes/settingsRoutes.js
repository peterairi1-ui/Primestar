const express = require('express');
const controller = require('../controllers/zoneController');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();
router.get('/', controller.getSettings);
router.put('/', requireAdmin, controller.upsertSettings);
module.exports = router;
