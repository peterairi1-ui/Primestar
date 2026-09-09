const Zone = require('../models/Zone');
const FormulaSettings = require('../models/FormulaSettings');
const { calculateDeliveryFee } = require('../services/deliveryService');
const { success } = require('../utils/api');
async function calculate(req, res) { const settings = await FormulaSettings.findOne({ active: true }).lean() || {}; const zones = await Zone.find({ active: true }).lean(); return success(res, calculateDeliveryFee({ destination: req.body.destination, pickupPoints: req.body.pickupPoints, zones, settings })); }
module.exports = { calculate };
