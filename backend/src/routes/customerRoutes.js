const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();
router.get('/me', authenticate('customer'), (req, res) => res.json({ success: true, data: req.auth.user }));
module.exports = router;
