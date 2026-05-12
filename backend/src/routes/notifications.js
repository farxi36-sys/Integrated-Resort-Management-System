const router = require('express').Router();
const { getNotifications, readNotifications } = require('../controllers/notificationController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/list', getNotifications);
router.post('/read', readNotifications);

module.exports = router;
