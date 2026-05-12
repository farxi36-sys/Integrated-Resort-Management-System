const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set. Set it in .env to seed the admin user.');
    process.exit(1);
  }
  await mongoose.connect(uri);
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@woodstone.local';
  const password = process.env.SEED_ADMIN_PASSWORD || 'demo1234';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }
  const hash = bcrypt.hashSync(password, 10);
  const user = new User({ name: 'Admin', email, password: hash, role: 'admin' });
  await user.save();
  console.log('Seeded admin user:', email, 'password:', password);
  process.exit(0);
}

seed().catch(err=>{ console.error(err); process.exit(1); });
