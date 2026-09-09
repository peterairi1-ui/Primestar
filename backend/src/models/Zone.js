const mongoose = require('mongoose');
const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, center: { latitude: Number, longitude: Number }, radiusKm: { type: Number, min: 0 }, fixedFee: { type: Number, min: 0 }, active: { type: Boolean, default: true }, notes: String
}, { timestamps: true });
zoneSchema.index({ name: 1 }, { unique: true });
module.exports = mongoose.model('Zone', zoneSchema);
