const { listNotifications, markNotificationsRead } = require('../utils/notificationCenter');

async function getNotifications(req, res, next) {
  try {
    const notifications = await listNotifications(req);
    res.json({ notifications });
  } catch (err) {
    next(err);
  }
}

async function readNotifications(req, res, next) {
  try {
    const { notificationIds } = req.body || {};
    const notifications = await markNotificationsRead(req, notificationIds);
    res.json({ notifications });
  } catch (err) {
    next(err);
  }
}

module.exports = { getNotifications, readNotifications };
