const Room = require('../models/Room');
const mongoose = require('mongoose');
const {
  ownerKey,
  isDemoMode,
  getDemoRooms,
  createDemoRoom,
  updateDemoRoom,
  deleteDemoRoom,
} = require('../utils/demoStore');

async function createRoom(req, res, next) {
  try {
    const { number, type, pricePerNight } = req.body;
    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      const room = createDemoRoom(ownerKey(req), { number, type, pricePerNight });
      return res.json({ room });
    }
    const room = new Room({ number, type, pricePerNight, owner: req.user.id });
    await room.save();
    res.json({ room });
  } catch (err) { next(err); }
}

async function listRooms(req, res, next) {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      return res.json({ rooms: getDemoRooms(ownerKey(req)) });
    }
    const rooms = await Room.find({ owner: req.user.id });
    res.json({ rooms });
  } catch (err) { next(err); }
}

async function updateRoom(req, res, next) {
  try {
    const id = req.params.id;
    const update = req.body;
    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      const room = updateDemoRoom(ownerKey(req), id, update);
      return res.json({ room });
    }
    const room = await Room.findOneAndUpdate({ _id: id, owner: req.user.id }, update, { new: true });
    res.json({ room });
  } catch (err) { next(err); }
}

async function deleteRoom(req, res, next) {
  try {
    const id = req.params.id;
    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      deleteDemoRoom(ownerKey(req), id);
      return res.json({ ok: true });
    }
    await Room.findOneAndDelete({ _id: id, owner: req.user.id });
    res.json({ ok: true });
  } catch (err) { next(err); }
}

// Public endpoint to get rooms by owner ID (for guest booking page)
async function getRoomsByOwner(req, res, next) {
  try {
    const { ownerId } = req.params;
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database unavailable' });
    }
    const rooms = await Room.find({ owner: ownerId });
    res.json({ rooms });
  } catch (err) { next(err); }
}

module.exports = { createRoom, listRooms, updateRoom, deleteRoom, getRoomsByOwner };
