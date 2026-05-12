const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const mongoose = require('mongoose');

async function stats(req, res, next) {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.json({ dailyRevenue: 0, totalBookings: 0, pendingPayments: 0, recentInvoices: [] });
    }
    const totalBookings = await Booking.countDocuments({ owner: req.user.id });
    const recentInvoices = await Invoice.find({ owner: req.user.id }).sort({ createdAt: -1 }).limit(5);
    const payments = await Payment.find({ booking: { $in: await Booking.find({ owner: req.user.id }).distinct('_id') } });
    const dailyRevenue = payments.reduce((s, p) => s + p.amount, 0);
    const pendingPayments = await Invoice.countDocuments({ owner: req.user.id, status: { $in: ['draft','issued','partial'] } });
    res.json({ dailyRevenue, totalBookings, pendingPayments, recentInvoices });
  } catch (err) { next(err); }
}

module.exports = { stats };
