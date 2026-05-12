const router = require('express').Router();
const { createBooking, updateBooking, cancelBooking, checkout, checkin, getBooking, listBookings, createGuestBooking, listPendingBookings, approveBooking, rejectBooking } = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Public routes (no auth required)
router.post('/guest/create', createGuestBooking);

// Protected routes (auth required)
router.use(auth);
router.post('/create', createBooking);
router.put('/:id', updateBooking);
router.post('/:id/cancel', cancelBooking);
router.post('/checkout', checkout);
router.post('/checkin', checkin);
router.get('/list', listBookings);
router.get('/pending', listPendingBookings);
router.post('/:id/approve', approveBooking);
router.post('/:id/reject', rejectBooking);
router.get('/:id', getBooking);

module.exports = router;
