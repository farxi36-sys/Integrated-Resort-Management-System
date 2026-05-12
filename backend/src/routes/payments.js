const router = require('express').Router();
const { addPayment } = require('../controllers/paymentController');

router.post('/add', addPayment);

module.exports = router;
