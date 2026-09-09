const mongoose = require('mongoose');
const get4meSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, requestId: { type: String, required: true, unique: true, index: true },
  guest: { name: String, phone: String, email: String },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  request: { type: String, required: true, trim: true },
  status: { type: String, enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'], default: 'requested', index: true },
  notes: String
}, { timestamps: true });
module.exports = mongoose.model('Get4MeRequest', get4meSchema);
