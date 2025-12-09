const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  cnic: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    country: String,
    zipCode: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
