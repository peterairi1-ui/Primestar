const express = require('express');
const controller = require('../controllers/zoneController');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();
router.get('/', controller.listZones);
router.post('/', requireAdmin, controller.createZone);
router.get('/settings', controller.getSettings);
router.put('/settings', requireAdmin, controller.upsertSettings);
module.exports = router;
