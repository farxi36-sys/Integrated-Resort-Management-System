const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const {
  ownerKey,
  isDemoMode,
  createDemoNotification,
  getDemoNotifications,
  markDemoNotificationsRead,
} = require('./demoStore');

async function recordNotification(req, payload) {
  const ownerId = ownerKey(req);
  if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
    return createDemoNotification(ownerId, payload);
  }

  return Notification.create({
    owner: req.user.id,
    booking: payload.bookingId || null,
    type: payload.type || 'info',
    title: payload.title,
    message: payload.message,
    read: false,
  });
}

async function listNotifications(req) {
  const ownerId = ownerKey(req);
  if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
    return getDemoNotifications(ownerId);
  }
  return Notification.find({ owner: req.user.id }).sort({ createdAt: -1 }).limit(100);
}

async function markNotificationsRead(req, notificationIds) {
  const ownerId = ownerKey(req);
  if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
    return markDemoNotificationsRead(ownerId, notificationIds);
  }
  const filter = notificationIds && notificationIds.length ? { _id: { $in: notificationIds }, owner: req.user.id } : { owner: req.user.id };
  await Notification.updateMany(filter, { $set: { read: true } });
  return listNotifications(req);
}

module.exports = { recordNotification, listNotifications, markNotificationsRead };
