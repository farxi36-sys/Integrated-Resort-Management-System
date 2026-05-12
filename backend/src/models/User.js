const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['owner', 'admin', 'staff'], default: 'owner' }
  ,owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

UserSchema.methods.comparePassword = function (candidate) {
  if (!this.password) return false;
  return bcrypt.compareSync(candidate, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
