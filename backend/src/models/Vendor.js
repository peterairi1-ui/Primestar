const mongoose = require('mongoose');
const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, description: String,
  logoUrl: String, bannerImageUrl: String, type: { type: String, enum: ['restaurant', 'get4me', 'package_delivery'], required: true },
  active: { type: Boolean, default: true }, displayOrder: { type: Number, default: 0 }, serviceConfig: mongoose.Schema.Types.Mixed
}, { timestamps: true });
module.exports = mongoose.model('Vendor', vendorSchema);
