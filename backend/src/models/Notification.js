const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
  type: { type: String, enum: ['booking_created', 'booking_approved', 'booking_rejected', 'booking_updated', 'booking_canceled', 'booking_checked_in', 'booking_checked_out', 'info'], default: 'info' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
