const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

async function listStaff(req, res, next) {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) return res.json({ users: [] });
    const users = await User.find({ owner: req.user.ownerId || req.user.id, role: 'staff' }).select('-password');
    res.json({ users });
  } catch (err) { next(err); }
}

async function createStaff(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'DB not connected' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: 'staff', owner: req.user.ownerId || req.user.id });
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
}

async function updateProfile(req, res, next) {
  try {
    const { name, businessName, email } = req.body;
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'DB not connected' });
    }
    const ownerId = req.user.ownerId || req.user.id;
    const user = await User.findOneAndUpdate(
      { _id: ownerId },
      { name, businessName, email },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'Owner not found' });
    res.json({ user: { id: user._id, ownerId: user._id.toString(), name: user.name, businessName: user.businessName, email: user.email, role: user.role } });
  } catch (err) { next(err); }
}

module.exports = { listStaff, createStaff, updateProfile };
