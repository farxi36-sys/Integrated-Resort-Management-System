const roomsByOwner = new Map();
const bookingsByOwner = new Map();
const invoicesByOwner = new Map();
const notificationsByOwner = new Map();

const baseRooms = [
  { number: '101', type: 'AC', pricePerNight: 4500 },
  { number: '102', type: 'AC', pricePerNight: 4800 },
  { number: '201', type: 'Non-AC', pricePerNight: 3200 },
  { number: '202', type: 'Non-AC', pricePerNight: 3000 },
];

function ownerKey(req) {
  return req?.user?.ownerId || req?.user?.id || 'demo';
}

function isDemoMode(req) {
  const owner = ownerKey(req);
  return String(owner).startsWith('demo');
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureRooms(ownerId) {
  if (!roomsByOwner.has(ownerId)) {
    roomsByOwner.set(
      ownerId,
      baseRooms.map((room, index) => ({
        _id: `${ownerId}-room-${index + 1}`,
        ...room,
        owner: ownerId,
        status: 'available',
      }))
    );
  }
  return roomsByOwner.get(ownerId);
}

function getDemoRooms(ownerId) {
  return clone(ensureRooms(ownerId));
}

function createDemoRoom(ownerId, data) {
  const room = {
    _id: `${ownerId}-room-${Date.now()}`,
    number: String(data.number || '').trim(),
    type: data.type || 'AC',
    pricePerNight: Number(data.pricePerNight || 0),
    status: data.status || 'available',
    owner: ownerId,
  };
  const rooms = ensureRooms(ownerId);
  rooms.unshift(room);
  return clone(room);
}

function updateDemoRoom(ownerId, roomId, update) {
  const rooms = ensureRooms(ownerId);
  const index = rooms.findIndex(room => room._id === roomId);
  if (index === -1) return null;
  rooms[index] = { ...rooms[index], ...update };
  return clone(rooms[index]);
}

function deleteDemoRoom(ownerId, roomId) {
  const rooms = ensureRooms(ownerId);
  const next = rooms.filter(room => room._id !== roomId);
  roomsByOwner.set(ownerId, next);
  return true;
}

function ensureBookings(ownerId) {
  if (!bookingsByOwner.has(ownerId)) bookingsByOwner.set(ownerId, []);
  return bookingsByOwner.get(ownerId);
}

function createDemoBooking(ownerId, payload) {
  const booking = {
    _id: `${ownerId}-booking-${Date.now()}`,
    owner: ownerId,
    guest: payload.guest,
    roomType: payload.roomType,
    checkIn: payload.checkIn,
    checkOut: payload.checkOut,
    totalNights: payload.totalNights,
    status: 'confirmed',
    room: null,
    createdAt: new Date().toISOString(),
  };
  const rooms = ensureRooms(ownerId);
  const room = rooms.find(item => item.type === payload.roomType && item.status === 'available');
  if (room) {
    room.status = 'occupied';
    booking.room = room._id;
  }
  ensureBookings(ownerId).unshift(booking);
  return clone(booking);
}

function getDemoBooking(ownerId, bookingId) {
  return clone(ensureBookings(ownerId).find(booking => booking._id === bookingId) || null);
}

function getDemoBookings(ownerId) {
  return clone(ensureBookings(ownerId));
}

function findDemoRoom(ownerId, roomType) {
  return ensureRooms(ownerId).find(room => room.type === roomType && room.status === 'available') || null;
}

function assignDemoRoomToBooking(ownerId, bookingId, roomType) {
  const bookings = ensureBookings(ownerId);
  const bookingIndex = bookings.findIndex(booking => booking._id === bookingId);
  if (bookingIndex === -1) return null;

  const rooms = ensureRooms(ownerId);
  const booking = bookings[bookingIndex];
  if (booking.room) {
    const currentRoom = rooms.find(room => room._id === booking.room);
    if (currentRoom) currentRoom.status = 'available';
  }

  const room = rooms.find(item => item.type === roomType && item.status === 'available');
  booking.room = room ? room._id : null;
  if (room) room.status = 'occupied';
  bookings[bookingIndex] = booking;
  return clone(booking);
}

function releaseDemoRoomForBooking(ownerId, bookingId) {
  const bookings = ensureBookings(ownerId);
  const booking = bookings.find(item => item._id === bookingId);
  if (!booking) return null;
  const rooms = ensureRooms(ownerId);
  if (booking.room) {
    const room = rooms.find(item => item._id === booking.room);
    if (room) room.status = 'available';
  }
  booking.room = null;
  return clone(booking);
}

function updateDemoBooking(ownerId, bookingId, update) {
  const bookings = ensureBookings(ownerId);
  const index = bookings.findIndex(booking => booking._id === bookingId);
  if (index === -1) return null;
  bookings[index] = { ...bookings[index], ...update };
  return clone(bookings[index]);
}

function ensureInvoices(ownerId) {
  if (!invoicesByOwner.has(ownerId)) invoicesByOwner.set(ownerId, []);
  return invoicesByOwner.get(ownerId);
}

function ensureNotifications(ownerId) {
  if (!notificationsByOwner.has(ownerId)) notificationsByOwner.set(ownerId, []);
  return notificationsByOwner.get(ownerId);
}

function createDemoNotification(ownerId, payload) {
  const notification = {
    _id: `${ownerId}-notification-${Date.now()}`,
    owner: ownerId,
    type: payload.type || 'info',
    title: payload.title || 'Notification',
    message: payload.message || '',
    bookingId: payload.bookingId || null,
    read: false,
    createdAt: new Date().toISOString(),
  };
  ensureNotifications(ownerId).unshift(notification);
  return clone(notification);
}

function getDemoNotifications(ownerId) {
  return clone(ensureNotifications(ownerId));
}

function markDemoNotificationsRead(ownerId, notificationIds) {
  const ids = new Set(notificationIds || []);
  const notifications = ensureNotifications(ownerId);
  notifications.forEach(notification => {
    if (!notificationIds || ids.has(notification._id)) notification.read = true;
  });
  return clone(notifications);
}

function createDemoInvoice(ownerId, payload) {
  const invoice = {
    _id: `${ownerId}-invoice-${Date.now()}`,
    owner: ownerId,
    invoiceNumber: payload.invoiceNumber,
    booking: payload.bookingSnapshot,
    lineItems: payload.lineItems,
    subtotal: payload.subtotal,
    total: payload.total,
    status: 'issued',
    createdAt: new Date().toISOString(),
  };
  ensureInvoices(ownerId).unshift(invoice);
  return clone(invoice);
}

function getDemoInvoices(ownerId) {
  return clone(ensureInvoices(ownerId));
}

function getDemoInvoice(ownerId, invoiceId) {
  return clone(ensureInvoices(ownerId).find(invoice => invoice._id === invoiceId) || null);
}

module.exports = {
  ownerKey,
  isDemoMode,
  getDemoRooms,
  createDemoRoom,
  updateDemoRoom,
  deleteDemoRoom,
  createDemoBooking,
  getDemoBooking,
  getDemoBookings,
  findDemoRoom,
  assignDemoRoomToBooking,
  releaseDemoRoomForBooking,
  updateDemoBooking,
  createDemoInvoice,
  getDemoInvoices,
  getDemoInvoice,
  createDemoNotification,
  getDemoNotifications,
  markDemoNotificationsRead,
};