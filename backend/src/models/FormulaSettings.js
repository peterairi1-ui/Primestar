const mongoose = require('mongoose');
const formulaSchema = new mongoose.Schema({ baseFee: { type: Number, min: 0, default: 0 }, perKilometreRate: { type: Number, min: 0, default: 0 }, maxDistanceKm: { type: Number, min: 0 }, active: { type: Boolean, default: true } }, { timestamps: true });
module.exports = mongoose.model('FormulaSettings', formulaSchema);
