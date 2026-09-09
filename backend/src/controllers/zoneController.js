const Zone = require('../models/Zone');
const FormulaSettings = require('../models/FormulaSettings');
const { success } = require('../utils/api');
async function listZones(req, res) { return success(res, await Zone.find({ active: true }).sort({ name: 1 })); }
async function createZone(req, res) { return success(res, await Zone.create(req.body), 201); }
async function upsertSettings(req, res) { return success(res, await FormulaSettings.findOneAndUpdate({}, req.body, { upsert: true, new: true, runValidators: true })); }
async function getSettings(req, res) { return success(res, await FormulaSettings.findOne() || { baseFee: 0, perKilometreRate: 0, active: true }); }
module.exports = { listZones, createZone, upsertSettings, getSettings };
