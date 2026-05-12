const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');
const {
  ownerKey,
  isDemoMode,
  getDemoBooking,
  createDemoInvoice,
  getDemoInvoices,
  getDemoInvoice,
} = require('../utils/demoStore');

function generateInvoiceNumber() {
  return 'INV-' + Date.now().toString().slice(-8);
}

async function generateInvoice(req, res, next) {
  try {
    const { bookingId, lineItems } = req.body;
    const ownerId = ownerKey(req);
    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Please select a valid booking before generating the invoice.' });
    }
    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      const booking = getDemoBooking(ownerId, bookingId);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });

      const subtotal = lineItems.reduce((s, it) => s + (it.qty || 1) * (it.rate || 0), 0);
      const total = +(subtotal).toFixed(2);
      const invoice = createDemoInvoice(ownerId, {
        invoiceNumber: generateInvoiceNumber(),
        bookingSnapshot: booking,
        lineItems,
        subtotal,
        total,
      });
      return res.json({ invoice });
    }
    const booking = await Booking.findOne({ _id: bookingId, owner: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const subtotal = lineItems.reduce((s, it) => s + (it.qty || 1) * (it.rate || 0), 0);
    const total = +(subtotal).toFixed(2);

    const invoice = new Invoice({ owner: req.user.id, invoiceNumber: generateInvoiceNumber(), booking: booking._id, lineItems, subtotal, total, status: 'issued' });
    await invoice.save();
    res.json({ invoice });
  } catch (err) { next(err); }
}

async function listInvoices(req, res, next) {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      return res.json({ invoices: getDemoInvoices(ownerKey(req)) });
    }
    const invoices = await Invoice.find({ owner: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json({ invoices });
  } catch (err) { next(err); }
}

async function getInvoice(req, res, next) {
  try {
    const id = req.params.id;
    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      const invoice = getDemoInvoice(ownerKey(req), id);
      if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
      return res.json({ invoice });
    }
    const invoice = await Invoice.findOne({ _id: id, owner: req.user.id }).populate('booking');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ invoice });
  } catch (err) { next(err); }
}

module.exports = { generateInvoice, listInvoices, getInvoice };
