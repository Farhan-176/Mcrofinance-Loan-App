const mongoose = require('mongoose');

const loanRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['Wedding Loans', 'Home Construction Loans', 'Business Startup Loans', 'Education Loans'],
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  loanAmount: {
    type: Number,
    required: true
  },
  loanPeriod: {
    type: Number, // in months
    required: true
  },
  initialDeposit: {
    type: Number,
    required: true
  },
  monthlyInstallment: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  tokenNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  appointmentDate: {
    type: Date
  },
  appointmentTime: {
    type: String
  },
  officeLocation: {
    type: String
  },
  guarantors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guarantor'
  }],
  documents: {
    salarySheet: String,
    statement: String,
    profilePhoto: String,
    cnicFront: String,
    cnicBack: String
  },
  additionalInfo: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LoanRequest', loanRequestSchema);
