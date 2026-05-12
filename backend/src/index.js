const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// simple request logger for debugging
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.path);
  next();
});

const PORT = process.env.PORT || 5001;

// Simple health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// DB connect (skip if not configured)
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error', err));
} else {
  console.log('MONGO_URI not set — running in SKIP_DB demo mode');
}

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/booking', require('./routes/bookings'));
app.use('/invoice', require('./routes/invoices'));
app.use('/payment', require('./routes/payments'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/rooms', require('./routes/rooms'));
app.use('/users', require('./routes/users'));
app.use('/notifications', require('./routes/notifications'));

// Debug: list registered routes
app.get('/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(layer => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(',');
      routes.push({ path: layer.route.path, methods });
    } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      layer.handle.stack.forEach(l => {
        if (l.route) {
          const methods = Object.keys(l.route.methods).join(',');
          routes.push({ path: (layer.regexp && layer.regexp.source) ? `${layer.regexp.source.replace('^\\/','/').replace('\\/?(?=\\/|$)','').replace('\\/','/')}` : '<mounted>', methods: methods + ' (mounted) - ' + l.route.path });
        }
      });
    }
  });
  res.json({ routes });
});

// Error handler
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
