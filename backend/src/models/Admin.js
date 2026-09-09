const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, trim: true }, passwordHash: { type: String, required: true, select: false }, role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' }, active: { type: Boolean, default: true }, otpHash: { type: String, select: false }, otpExpiresAt: Date, otpAttempts: { type: Number, default: 0 }, otpSentAt: Date, passwordResetHash: { type: String, select: false }, passwordResetExpiresAt: Date
}, { timestamps: true });
module.exports = mongoose.model('Admin', adminSchema);
