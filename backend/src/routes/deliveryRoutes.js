const express = require('express');
const { body } = require('express-validator');
const { calculate } = require('../controllers/deliveryController');
const { validate } = require('../middleware/validation');
const router = express.Router();
router.post('/calculate', [body('destination.latitude').isFloat({ min: -90, max: 90 }), body('destination.longitude').isFloat({ min: -180, max: 180 }), validate], calculate);
module.exports = router;
