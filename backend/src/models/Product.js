const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true }, name: { type: String, required: true, trim: true }, slug: { type: String, required: true, trim: true }, description: String,
  price: { type: Number, required: true, min: 0 }, imageUrl: String, category: { type: String, required: true, trim: true }, available: { type: Boolean, default: true, index: true }, displayOrder: { type: Number, default: 0 }, upsell: mongoose.Schema.Types.Mixed
}, { timestamps: true });
productSchema.index({ vendor: 1, category: 1 });
module.exports = mongoose.model('Product', productSchema);
