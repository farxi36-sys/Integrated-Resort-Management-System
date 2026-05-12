const router = require('express').Router();
const { generateInvoice, listInvoices, getInvoice } = require('../controllers/invoiceController');
const { invoicePdf } = require('../controllers/invoicePdfController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/generate', generateInvoice);
router.get('/list', listInvoices);
router.get('/pdf', invoicePdf);
router.get('/:id', getInvoice);

module.exports = router;
