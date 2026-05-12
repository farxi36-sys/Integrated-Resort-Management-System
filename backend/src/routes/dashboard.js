const router = require('express').Router();
const { stats } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/stats', stats);

module.exports = router;
