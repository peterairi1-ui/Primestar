const express = require('express');
const controller = require('../controllers/packageController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();
router.post('/', (req, res, next) => { if (req.headers.authorization) return authenticate('customer')(req, res, next); next(); }, controller.createRequest);
module.exports = router;
