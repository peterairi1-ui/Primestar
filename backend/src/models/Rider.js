const mongoose = require('mongoose');
const riderSchema = new mongoose.Schema({
  name: { type: String, required: true }, phone: { type: String, required: true }, username: { type: String, required: true, unique: true, lowercase: true, trim: true }, passwordHash: { type: String, required: true, select: false }, online: { type: Boolean, default: false }, active: { type: Boolean, default: true }, availableFloat: { type: Number, default: 0, min: 0 }, lastAssignedAt: Date, currentLocation: { latitude: Number, longitude: Number }
}, { timestamps: true });
module.exports = mongoose.model('Rider', riderSchema);
