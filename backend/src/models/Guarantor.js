const mongoose = require('mongoose');

const guarantorSchema = new mongoose.Schema({
  loanRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanRequest',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  cnic: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Guarantor', guarantorSchema);
