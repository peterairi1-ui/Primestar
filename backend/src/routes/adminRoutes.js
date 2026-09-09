const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const { getMe } = require('../controllers/adminController');
const router = express.Router();
router.get('/me', requireAdmin, getMe);
module.exports = router;
