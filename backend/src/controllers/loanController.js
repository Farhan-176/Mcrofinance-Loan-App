const path = require('path');
const fs = require('fs');
const LoanRequest = require('../models/LoanRequest');
const Guarantor = require('../models/Guarantor');
const { calculateLoan, loanCategories } = require('../utils/loanCalculations');
const { generateQRCode, generateTokenNumber } = require('../utils/helpers');

// Get loan categories
const getLoanCategories = (req, res) => {
  res.json(loanCategories);
};

// Calculate loan
const calculateLoanEstimate = (req, res) => {
  try {
    const { category, loanAmount, initialDeposit, periodMonths } = req.body;

    // Validate category
    if (!loanCategories[category]) {
      return res.status(400).json({ message: 'Invalid loan category' });
    }

    // Validate loan amount
    const maxAmount = loanCategories[category].maxAmount;
    if (maxAmount && loanAmount > maxAmount) {
      return res.status(400).json({ 
        message: `Loan amount exceeds maximum limit of PKR ${maxAmount}` 
      });
    }

    const calculation = calculateLoan(loanAmount, initialDeposit, periodMonths);
    res.json(calculation);
  } catch (error) {
    console.error('Calculate loan error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create loan request
const createLoanRequest = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      loanAmount,
      loanPeriod,
      initialDeposit,
      additionalInfo
    } = req.body;

    const userId = req.user._id;

    // Calculate monthly installment
    const calculation = calculateLoan(loanAmount, initialDeposit, loanPeriod);

    const loanRequest = new LoanRequest({
      userId,
      category,
      subcategory,
      loanAmount,
      loanPeriod,
      initialDeposit,
      monthlyInstallment: calculation.monthlyInstallment,
      additionalInfo
    });

    await loanRequest.save();

    res.status(201).json({
      message: 'Loan request created successfully',
      loanRequest
    });
  } catch (error) {
    console.error('Create loan request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add guarantors to loan request
const addGuarantors = async (req, res) => {
  try {
    const { loanRequestId } = req.params;
    const { guarantors } = req.body; // Array of two guarantors

    if (!guarantors || guarantors.length !== 2) {
      return res.status(400).json({ message: 'Exactly two guarantors are required' });
    }

    const loanRequest = await LoanRequest.findById(loanRequestId);
    if (!loanRequest) {
      return res.status(404).json({ message: 'Loan request not found' });
    }

    // Verify user owns this loan request
    if (loanRequest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Create guarantors
    const guarantorIds = [];
    for (const guarantorData of guarantors) {
      const guarantor = new Guarantor({
        loanRequestId,
        ...guarantorData
      });
      await guarantor.save();
      guarantorIds.push(guarantor._id);
    }

    loanRequest.guarantors = guarantorIds;
    await loanRequest.save();

    res.json({
      message: 'Guarantors added successfully',
      loanRequest
    });
  } catch (error) {
    console.error('Add guarantors error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload documents (profile photo, CNIC front/back)
const uploadDocuments = async (req, res) => {
  try {
    const { loanRequestId } = req.params;
    const loanRequest = await LoanRequest.findById(loanRequestId);

    if (!loanRequest) {
      return res.status(404).json({ message: 'Loan request not found' });
    }

    // Ensure ownership
    if (loanRequest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const files = req.files || {};
    const updates = {};

    if (files.profilePhoto?.[0]) {
      updates['documents.profilePhoto'] = `/uploads/${files.profilePhoto[0].filename}`;
    }

    if (files.cnicFront?.[0]) {
      updates['documents.cnicFront'] = `/uploads/${files.cnicFront[0].filename}`;
    }

    if (files.cnicBack?.[0]) {
      updates['documents.cnicBack'] = `/uploads/${files.cnicBack[0].filename}`;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const updatedLoanRequest = await LoanRequest.findByIdAndUpdate(
      loanRequestId,
      { $set: updates },
      { new: true }
    );

    res.json({
      message: 'Documents uploaded successfully',
      loanRequest: updatedLoanRequest
    });
  } catch (error) {
    console.error('Upload documents error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's loan requests
const getUserLoanRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const loanRequests = await LoanRequest.find({ userId })
      .populate('guarantors')
      .sort({ createdAt: -1 })
      .lean();

    // Remove duplicates by _id just in case
    const uniqueRequests = Array.from(
      new Map(loanRequests.map(req => [req._id.toString(), req])).values()
    );

    res.json(uniqueRequests);
  } catch (error) {
    console.error('Get loan requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single loan request
const getLoanRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const loanRequest = await LoanRequest.findById(id)
      .populate('userId', 'name email cnic phoneNumber address')
      .populate('guarantors');

    if (!loanRequest) {
      return res.status(404).json({ message: 'Loan request not found' });
    }

    // Check authorization
    if (loanRequest.userId._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(loanRequest);
  } catch (error) {
    console.error('Get loan request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate slip with QR code
const generateSlip = async (req, res) => {
  try {
    const { loanRequestId } = req.params;

    const loanRequest = await LoanRequest.findById(loanRequestId)
      .populate('userId', 'name email cnic')
      .populate('guarantors');

    if (!loanRequest) {
      return res.status(404).json({ message: 'Loan request not found' });
    }

    // Verify user owns this loan request
    if (loanRequest.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if slip already generated
    if (!loanRequest.tokenNumber) {
      return res.status(400).json({ 
        message: 'Token number not assigned yet. Please wait for admin approval.' 
      });
    }

    // Generate QR code
    const qrData = {
      tokenNumber: loanRequest.tokenNumber,
      name: loanRequest.userId.name,
      cnic: loanRequest.userId.cnic,
      loanAmount: loanRequest.loanAmount,
      category: loanRequest.category
    };

    const qrCode = await generateQRCode(qrData);

    const slipData = {
      tokenNumber: loanRequest.tokenNumber,
      applicantName: loanRequest.userId.name,
      cnic: loanRequest.userId.cnic,
      loanAmount: loanRequest.loanAmount,
      category: loanRequest.category,
      subcategory: loanRequest.subcategory,
      appointmentDate: loanRequest.appointmentDate,
      appointmentTime: loanRequest.appointmentTime,
      officeLocation: loanRequest.officeLocation,
      qrCode
    };

    res.json(slipData);
  } catch (error) {
    console.error('Generate slip error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getLoanCategories,
  calculateLoanEstimate,
  createLoanRequest,
  addGuarantors,
  getUserLoanRequests,
  getLoanRequest,
  generateSlip,
  uploadDocuments
};
