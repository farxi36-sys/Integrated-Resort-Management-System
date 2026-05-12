const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  type: { type: String, enum: ['AC', 'Non-AC'], required: true },
  pricePerNight: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['available','occupied','maintenance'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.models.Room || mongoose.model('Room', RoomSchema);
