const Booking = require('../models/Booking');
const Room = require('../models/Room');
const mongoose = require('mongoose');
const {
  ownerKey,
  isDemoMode,
  createDemoBooking,
  getDemoBooking,
  updateDemoBooking,
  getDemoRooms,
  getDemoBookings,
  findDemoRoom,
  assignDemoRoomToBooking,
  releaseDemoRoomForBooking,
} = require('../utils/demoStore');
const { recordNotification } = require('../utils/notificationCenter');
const { notifyBookingApproved, notifyBookingRejected, notifyBookingCancelled } = require('../utils/guestNotifications');

function nightsBetween(start, end) {
  if (!start || !end) return 0;
  const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
  return diff <= 0 ? 1 : diff;
}

async function createBooking(req, res, next) {
  try {
    const { guest, roomType, checkIn, checkOut } = req.body;
    const totalNights = nightsBetween(checkIn, checkOut);
    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      const booking = createDemoBooking(ownerKey(req), { guest, roomType, checkIn, checkOut, totalNights });
      await recordNotification(req, {
        bookingId: booking._id,
        type: 'booking_created',
        title: 'Booking created',
        message: `${booking.guest?.name || 'Guest'} booking was created for ${booking.roomType || 'room'}.`,
      });
      return res.json({ booking, rooms: getDemoRooms(ownerKey(req)) });
    }
    const booking = new Booking({ owner: req.user.id, guest, roomType, checkIn, checkOut, totalNights, status: 'confirmed' });
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const room = await Room.findOne({ owner: req.user.id, type: roomType, status: 'available' });
      if (room) {
        booking.room = room._id;
        room.status = 'occupied';
        await room.save();
      }
      await booking.save();
    }
    await recordNotification(req, {
      bookingId: booking._id,
      type: 'booking_created',
      title: 'Booking created',
      message: `${booking.guest?.name || 'Guest'} booking was created for ${booking.roomType || 'room'}.`,
    });
    res.json({ booking });
  } catch (err) { next(err); }
}

async function updateBooking(req, res, next) {
  try {
    const bookingId = req.params.id;
    const { guest = {}, roomType, checkIn, checkOut, notes } = req.body;
    const totalNights = nightsBetween(checkIn, checkOut);

    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      const current = getDemoBooking(ownerKey(req), bookingId);
      if (!current) return res.status(404).json({ message: 'Booking not found' });
      let updated = updateDemoBooking(ownerKey(req), bookingId, {
        guest: { ...current.guest, ...guest },
        roomType: roomType || current.roomType,
        checkIn: checkIn || current.checkIn,
        checkOut: checkOut || current.checkOut,
        totalNights,
        notes: notes ?? current.notes,
      });
      if (roomType && roomType !== current.roomType) {
        updated = assignDemoRoomToBooking(ownerKey(req), bookingId, roomType) || updated;
      }
      await recordNotification(req, {
        bookingId: updated._id,
        type: 'booking_updated',
        title: 'Booking updated',
        message: `${updated.guest?.name || 'Guest'} booking details were updated.`,
      });
      return res.json({ booking: updated });
    }

    const booking = await Booking.findOne({ _id: bookingId, owner: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const previousRoomId = booking.room ? booking.room.toString() : null;
    const previousRoomType = booking.roomType;

    booking.guest = { ...(booking.guest || {}), ...guest };
    if (roomType) booking.roomType = roomType;
    if (checkIn) booking.checkIn = checkIn;
    if (checkOut) booking.checkOut = checkOut;
    if (notes !== undefined) booking.notes = notes;
    booking.totalNights = nightsBetween(booking.checkIn, booking.checkOut);

    const needsRoomRefresh = roomType && roomType !== previousRoomType;
    if (needsRoomRefresh && previousRoomId) {
      const previousRoom = await Room.findOne({ _id: previousRoomId, owner: req.user.id });
      if (previousRoom) {
        previousRoom.status = 'available';
        await previousRoom.save();
      }
      booking.room = null;
    }

    if (needsRoomRefresh || !booking.room) {
      const room = await Room.findOne({ owner: req.user.id, type: booking.roomType, status: 'available' });
      if (room) {
        booking.room = room._id;
        room.status = 'occupied';
        await room.save();
      }
    }

    await booking.save();
    await recordNotification(req, {
      bookingId: booking._id,
      type: 'booking_updated',
      title: 'Booking updated',
      message: `${booking.guest?.name || 'Guest'} booking details were updated.`,
    });
    res.json({ booking });
  } catch (err) { next(err); }
}

async function checkout(req, res, next) {
  try {
    const { bookingId } = req.body;
    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      const updated = updateDemoBooking(ownerKey(req), bookingId, { status: 'checked_out' });
      if (!updated) return res.status(404).json({ message: 'Booking not found' });
      const booking = releaseDemoRoomForBooking(ownerKey(req), bookingId) || updated;
      await recordNotification(req, {
        bookingId: booking._id,
        type: 'booking_checked_out',
        title: 'Guest checked out',
        message: `${booking.guest?.name || 'Guest'} checked out early.`,
      });
      return res.json({ booking });
    }
    const booking = await Booking.findOne({ _id: bookingId, owner: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'checked_out';
    await booking.save();
    if (booking.room) {
      const room = await Room.findOne({ _id: booking.room, owner: req.user.id });
      if (room) {
        room.status = 'available';
        await room.save();
      }
    }
    await recordNotification(req, {
      bookingId: booking._id,
      type: 'booking_checked_out',
      title: 'Guest checked out',
      message: `${booking.guest?.name || 'Guest'} checked out early.`,
    });
    res.json({ booking });
  } catch (err) { next(err); }
}

async function checkin(req, res, next) {
  try {
    const { bookingId } = req.body;
    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      const booking = updateDemoBooking(ownerKey(req), bookingId, { status: 'checked_in' });
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      await recordNotification(req, {
        bookingId: booking._id,
        type: 'booking_checked_in',
        title: 'Guest checked in',
        message: `${booking.guest?.name || 'Guest'} is now checked in.`,
      });
      return res.json({ booking });
    }
    const booking = await Booking.findOne({ _id: bookingId, owner: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'checked_in';
    await booking.save();
    if (booking.room) {
      const room = await Room.findOne({ _id: booking.room, owner: req.user.id });
      if (room) { room.status = 'occupied'; await room.save(); }
    }
    await recordNotification(req, {
      bookingId: booking._id,
      type: 'booking_checked_in',
      title: 'Guest checked in',
      message: `${booking.guest?.name || 'Guest'} is now checked in.`,
    });
    res.json({ booking });
  } catch (err) { next(err); }
}

async function cancelBooking(req, res, next) {
  try {
    const bookingId = req.params.id;
    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      const updated = updateDemoBooking(ownerKey(req), bookingId, { status: 'canceled' });
      if (!updated) return res.status(404).json({ message: 'Booking not found' });
      const booking = releaseDemoRoomForBooking(ownerKey(req), bookingId) || updated;
      await recordNotification(req, {
        bookingId: booking._id,
        type: 'booking_canceled',
        title: 'Booking canceled',
        message: `${booking.guest?.name || 'Guest'} booking was canceled.`,
      });
      return res.json({ booking });
    }

    const booking = await Booking.findOne({ _id: bookingId, owner: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'canceled';
    await booking.save();
    if (booking.room) {
      const room = await Room.findOne({ _id: booking.room, owner: req.user.id });
      if (room) {
        room.status = 'available';
        await room.save();
      }
    }
    await recordNotification(req, {
      bookingId: booking._id,
      type: 'booking_canceled',
      title: 'Booking canceled',
      message: `${booking.guest?.name || 'Guest'} booking was canceled.`,
    });

    // Send SMS and/or email to guest informing of cancellation
    try {
      const owner = await require('../models/User').findById(req.user.id);
      await notifyBookingCancelled(booking, owner);
    } catch (guestNotifErr) {
      console.error('Failed to send guest cancellation notification:', guestNotifErr.message || guestNotifErr);
      // Don't fail the cancellation if guest notification fails
    }

    res.json({ booking });
  } catch (err) { next(err); }
}

async function getBooking(req, res, next) {
  try {
    const id = req.params.id;
    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      const booking = getDemoBooking(ownerKey(req), id);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      return res.json({ booking });
    }
    const booking = await Booking.findOne({ _id: id, owner: req.user.id }).populate('room');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ booking });
  } catch (err) { next(err); }
}

async function listBookings(req, res, next) {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      const bookings = getDemoBookings(ownerKey(req));
      return res.json({ bookings });
    }
    const bookings = await Booking.find({ owner: req.user.id }).sort({ createdAt: -1 }).populate('room');
    res.json({ bookings });
  } catch (err) { next(err); }
}

// Public guest booking creation (no auth required)
async function createGuestBooking(req, res, next) {
  try {
    const { guest, roomType, checkIn, checkOut, ownerId, roomId } = req.body;
    const totalNights = nightsBetween(checkIn, checkOut);
    
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database unavailable' });
    }

    // Verify owner exists
    const ownerExists = await require('../models/User').findById(ownerId);
    if (!ownerExists) {
      return res.status(400).json({ message: 'Invalid resort' });
    }

    const booking = new Booking({
      owner: ownerId,
      guest,
      roomType,
      checkIn,
      checkOut,
      totalNights,
      status: 'pending' // Guest bookings start as pending
    });

    // If client provided a specific roomId, try to assign it if it belongs to owner and is available
    if (roomId && mongoose.Types.ObjectId.isValid(roomId)) {
      try {
        const desired = await Room.findOne({ _id: roomId, owner: ownerId });
        if (desired && desired.status === 'available') {
          booking.room = desired._id;
          desired.status = 'occupied';
          await desired.save();
          // ensure booking.roomType matches the assigned room's type
          booking.roomType = desired.type;
        }
      } catch (e) {
        // ignore any errors resolving the provided roomId and proceed with normal flow
        console.error('Failed to assign provided roomId:', e.message || e);
      }
    }

    await booking.save();

    // Create notification directly for guest bookings (no authenticated user)
    try {
      await require('../models/Notification').create({
        owner: ownerId,
        booking: booking._id,
        type: 'booking_created',
        title: 'New booking request',
        message: `${booking.guest?.name || 'Guest'} submitted a booking request for ${booking.roomType || 'room'}.`,
        read: false,
      });
    } catch (notifErr) {
      console.error('Failed to create notification:', notifErr);
      // Don't fail the booking creation if notification fails
    }

    res.status(201).json({ booking });
  } catch (err) { next(err); }
}

// List pending bookings (owner only)
async function listPendingBookings(req, res, next) {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database unavailable' });
    }

    const bookings = await Booking.find({ owner: req.user.id, status: 'pending' }).sort({ createdAt: -1 }).populate('room');
    res.json({ bookings });
  } catch (err) { next(err); }
}

// Approve a pending booking (owner only)
async function approveBooking(req, res, next) {
  try {
    const bookingId = req.params.id;
    
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database unavailable' });
    }

    const booking = await Booking.findOne({ _id: bookingId, owner: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be approved' });
    }

    booking.status = 'confirmed';
    
    // Assign available room if not already assigned
    if (!booking.room) {
      const room = await Room.findOne({ owner: req.user.id, type: booking.roomType, status: 'available' });
      if (room) {
        booking.room = room._id;
        room.status = 'occupied';
        await room.save();
      }
    }

    await booking.save();
    
    // Create notification for booking approval in owner panel
    try {
      await require('../models/Notification').create({
        owner: req.user.id,
        booking: booking._id,
        type: 'booking_approved',
        title: 'Booking approved',
        message: `${booking.guest?.name || 'Guest'} booking for ${booking.roomType || 'room'} has been approved!`,
        read: false,
      });
    } catch (notifErr) {
      console.error('Failed to create approval notification:', notifErr);
    }

    // Send SMS and/or email to guest
    try {
      const owner = await require('../models/User').findById(req.user.id);
      await notifyBookingApproved(booking, owner);
    } catch (guestNotifErr) {
      console.error('Failed to send guest approval notification:', guestNotifErr.message || guestNotifErr);
      // Don't fail the approval if guest notification fails
    }

    res.json({ booking });
  } catch (err) { next(err); }
}

// Reject a pending booking (owner only)
async function rejectBooking(req, res, next) {
  try {
    const bookingId = req.params.id;
    const { reason } = req.body;
    
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database unavailable' });
    }

    const booking = await Booking.findOne({ _id: bookingId, owner: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be rejected' });
    }

    booking.status = 'rejected';
    booking.notes = reason || 'Booking rejected by owner';
    
    // Release room if assigned
    if (booking.room) {
      const room = await Room.findOne({ _id: booking.room, owner: req.user.id });
      if (room) {
        room.status = 'available';
        await room.save();
      }
    }

    await booking.save();
    
    // Create notification for booking rejection in owner panel
    try {
      await require('../models/Notification').create({
        owner: req.user.id,
        booking: booking._id,
        type: 'booking_rejected',
        title: 'Booking rejected',
        message: `${booking.guest?.name || 'Guest'} booking has been rejected. ${reason ? 'Reason: ' + reason : ''}`,
        read: false,
      });
    } catch (notifErr) {
      console.error('Failed to create rejection notification:', notifErr);
    }

    // Send SMS and/or email to guest informing of rejection
    try {
      const owner = await require('../models/User').findById(req.user.id);
      await notifyBookingRejected(booking, owner, reason);
    } catch (guestNotifErr) {
      console.error('Failed to send guest rejection notification:', guestNotifErr.message || guestNotifErr);
      // Don't fail the rejection if guest notification fails
    }

    res.json({ booking });
  } catch (err) { next(err); }
}

module.exports = { createBooking, updateBooking, cancelBooking, checkout, checkin, getBooking, listBookings, createGuestBooking, listPendingBookings, approveBooking, rejectBooking };
