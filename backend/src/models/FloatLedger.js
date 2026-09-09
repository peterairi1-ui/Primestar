const mongoose = require('mongoose');
const ledgerSchema = new mongoose.Schema({ rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', required: true, index: true }, order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, transactionType: { type: String, enum: ['credit', 'debit', 'adjustment'], required: true }, amount: { type: Number, required: true, min: 0 }, balanceBefore: { type: Number, required: true, min: 0 }, balanceAfter: { type: Number, required: true, min: 0 }, description: { type: String, required: true }, reference: String
}, { timestamps: true });
module.exports = mongoose.model('FloatLedger', ledgerSchema);
