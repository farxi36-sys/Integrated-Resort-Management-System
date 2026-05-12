const mongoose = require('mongoose');

const LineItemSchema = new mongoose.Schema({
  description: String,
  qty: { type: Number, default: 1 },
  rate: Number,
  amount: Number
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  lineItems: [LineItemSchema],
  subtotal: Number,
  total: Number,
  status: { type: String, enum: ['draft','issued','partial','paid'], default: 'draft' }
}, { timestamps: true });

module.exports = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
