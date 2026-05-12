const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['Cash','UPI','Card'], default: 'Cash' },
  reference: String,
  status: { type: String, enum: ['pending','completed','failed'], default: 'completed' }
}, { timestamps: true });

module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
