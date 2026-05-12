const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'demo_secret';

function signUser(user) {
  const ownerId = user.owner ? user.owner.toString() : user._id.toString();
  return jwt.sign(
    { id: user._id.toString(), role: user.role, ownerId },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = bcrypt.compareSync(password, user.password || '');
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signUser(user);
    return res.json({
      token,
      user: {
        id: user._id.toString(),
        ownerId: user.owner ? user.owner.toString() : user._id.toString(),
        name: user.name,
        businessName: user.businessName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const { name, businessName, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const user = await User.create({
      name,
      businessName,
      email,
      password: hash,
      role: 'owner'
    });

    const token = signUser(user);
    return res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        ownerId: user._id.toString(),
        name: user.name,
        businessName: user.businessName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id.toString(),
        ownerId: user.owner ? user.owner.toString() : user._id.toString(),
        name: user.name,
        businessName: user.businessName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) { next(err); }
}

async function publicResortConfig(req, res, next) {
  try {
    const user = await User.findOne({ role: { $in: ['admin', 'owner'] } }).sort({ createdAt: 1 });
    if (!user) {
      return res.status(404).json({ message: 'Resort configuration not found' });
    }

    res.json({
      ownerId: user._id.toString(),
      name: user.name,
      businessName: user.businessName,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, register, me, publicResortConfig };
