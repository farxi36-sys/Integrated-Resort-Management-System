const Invoice = require('../models/Invoice');
const PDFDocument = require('pdfkit');
const { ownerKey, isDemoMode, getDemoInvoice } = require('../utils/demoStore');

async function invoicePdf(req, res, next) {
  try {
    const { invoiceId } = req.query;
    if (!invoiceId) return res.status(400).json({ message: 'invoiceId required' });
    const mongoose = require('mongoose');
    if (!mongoose.connection || mongoose.connection.readyState !== 1 || isDemoMode(req)) {
      const invoice = getDemoInvoice(ownerKey(req), invoiceId);
      if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);
        res.send(result);
      });

      doc.fontSize(18).text('Wood Stone Corbett', { align: 'left' });
      doc.fontSize(10).text('Chunakhan, Nainital', { align: 'left' });
      doc.moveDown();

      doc.fontSize(12).text(`Invoice: ${invoice.invoiceNumber}`);
      doc.text(`Date: ${new Date(invoice.createdAt).toDateString()}`);
      doc.moveDown();

      const guest = invoice.booking ? invoice.booking.guest : { name: 'N/A' };
      doc.text(`Guest: ${guest.name}`);
      if (invoice.booking) {
        doc.text(`Phone: ${invoice.booking.guest.phone || ''}`);
        doc.text(`CheckIn: ${invoice.booking.checkIn ? new Date(invoice.booking.checkIn).toLocaleDateString() : ''}`);
        doc.text(`CheckOut: ${invoice.booking.checkOut ? new Date(invoice.booking.checkOut).toLocaleDateString() : ''}`);
      }
      doc.moveDown();

      doc.fontSize(11).text('Description', { continued: true, width: 300 });
      doc.text('Qty', { continued: true, align: 'center' });
      doc.text('Rate', { continued: true, align: 'right' });
      doc.text('Amount', { align: 'right' });
      doc.moveDown(0.5);

      invoice.lineItems.forEach(item => {
        doc.text(item.description, { continued: true, width: 300 });
        doc.text(String(item.qty || 1), { continued: true, align: 'center' });
        doc.text((item.rate || 0).toFixed(2), { continued: true, align: 'right' });
        doc.text(((item.qty || 1) * (item.rate || 0)).toFixed(2), { align: 'right' });
      });

      doc.moveDown();
      doc.text(`Booking Amount: ${invoice.total.toFixed(2)}`, { align: 'right' });

      doc.end();
      return;
    }
    const invoice = await Invoice.findById(invoiceId).populate('booking');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const result = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);
      res.send(result);
    });

    // Header
    doc.fontSize(18).text('Wood Stone Corbett', { align: 'left' });
    doc.fontSize(10).text('Chunakhan, Nainital', { align: 'left' });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice: ${invoice.invoiceNumber}`);
    doc.text(`Date: ${invoice.createdAt.toDateString()}`);
    doc.moveDown();

    // Guest
    const guest = invoice.booking ? invoice.booking.guest : { name: 'N/A' };
    doc.text(`Guest: ${guest.name}`);
    if (invoice.booking) {
      doc.text(`Phone: ${invoice.booking.guest.phone || ''}`);
      doc.text(`CheckIn: ${invoice.booking.checkIn ? new Date(invoice.booking.checkIn).toLocaleDateString() : ''}`);
      doc.text(`CheckOut: ${invoice.booking.checkOut ? new Date(invoice.booking.checkOut).toLocaleDateString() : ''}`);
    }
    doc.moveDown();

    // Table header
    doc.fontSize(11).text('Description', { continued: true, width: 300 });
    doc.text('Qty', { continued: true, align: 'center' });
    doc.text('Rate', { continued: true, align: 'right' });
    doc.text('Amount', { align: 'right' });
    doc.moveDown(0.5);

    invoice.lineItems.forEach(item => {
      doc.text(item.description, { continued: true, width: 300 });
      doc.text(String(item.qty || 1), { continued: true, align: 'center' });
      doc.text((item.rate || 0).toFixed(2), { continued: true, align: 'right' });
      doc.text(((item.qty || 1) * (item.rate || 0)).toFixed(2), { align: 'right' });
    });

    doc.moveDown();
    doc.text(`Booking Amount: ${invoice.total.toFixed(2)}`, { align: 'right' });

    doc.end();
  } catch (err) { next(err); }
}

module.exports = { invoicePdf };
