const router = require('express').Router();
const { createRoom, listRooms, updateRoom, deleteRoom, getRoomsByOwner } = require('../controllers/roomController');
const auth = require('../middleware/auth');

// Public routes (no auth required)
router.get('/owner/:ownerId', getRoomsByOwner);

// Protected routes (auth required)
router.use(auth);
router.post('/create', createRoom);
router.get('/list', listRooms);
router.post('/update/:id', updateRoom);
router.post('/delete/:id', deleteRoom);

module.exports = router;
