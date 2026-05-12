const router = require('express').Router();
const { login, register, me, publicResortConfig } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.get('/public-resort', publicResortConfig);
router.get('/me', auth, me);

module.exports = router;
