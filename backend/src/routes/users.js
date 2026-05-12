const router = require('express').Router();
const auth = require('../middleware/auth');
const { listStaff, createStaff, updateProfile } = require('../controllers/userController');

router.use(auth);
router.get('/staff', listStaff);
router.post('/staff', createStaff);
router.put('/profile', updateProfile);

module.exports = router;
