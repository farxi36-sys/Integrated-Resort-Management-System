const router = require('express').Router();
const { invoicePdf } = require('../controllers/invoicePdfController');

router.get('/pdf', invoicePdf);

module.exports = router;
