const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({ label: String, address: { type: String, required: true }, area: String, landmark: String, latitude: Number, longitude: Number }, { _id: true });
const customerSchema = new mongoose.Schema({
  name: { type: String, trim: true }, phone: { type: String, trim: true, index: true }, email: { type: String, lowercase: true, trim: true }, username: { type: String, lowercase: true, trim: true, sparse: true, unique: true }, passwordHash: { type: String, select: false }, profilePhotoUrl: String, savedAddresses: [addressSchema], status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });
module.exports = mongoose.model('Customer', customerSchema);
