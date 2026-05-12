const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

async function addPayment(req, res, next) {
  try {
    const { invoiceId, amount, method, reference } = req.body;
    const mongoose = require('mongoose');
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'DB not connected — payments not available in demo mode' });
    }
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    const payment = new Payment({ invoice: invoice._id, booking: invoice.booking, amount, method, reference, status: 'completed' });
    await payment.save();
    // For simplicity, mark invoice as paid if payments cover total
    const payments = await Payment.find({ invoice: invoice._id });
    const received = payments.reduce((s, p) => s + p.amount, 0);
    if (received >= invoice.total) {
      invoice.status = 'paid';
      await invoice.save();
    } else {
      invoice.status = 'partial';
      await invoice.save();
    }
    res.json({ payment, invoice });
  } catch (err) { next(err); }
}

module.exports = { addPayment };
