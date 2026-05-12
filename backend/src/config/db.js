const mongoose = require('mongoose');

async function connect(uri) {
  if (!uri) {
    console.log('No MONGO_URI provided — skipping DB connect');
    return;
  }
  await mongoose.connect(uri);
}

module.exports = { connect };
