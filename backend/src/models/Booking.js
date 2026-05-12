const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guest: {
    name: String,
    phone: String,
    email: String,
    idProof: String
  },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  roomType: { type: String, enum: ['AC','Non-AC'] },
  checkIn: { type: Date },
  checkOut: { type: Date },
  totalNights: { type: Number },
  status: { type: String, enum: ['pending','confirmed','checked_in','checked_out','canceled','rejected'], default: 'pending' },
  notes: String
}, { timestamps: true });

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
