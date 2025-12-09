const LoanRequest = require('../models/LoanRequest');
const User = require('../models/User');
const { generateTokenNumber } = require('../utils/helpers');

// Get all loan applications
const getAllApplications = async (req, res) => {
  try {
    const { city, country, status } = req.query;

    let query = {};

    // Build query based on filters
    if (status) {
      query.status = status;
    }

    const applications = await LoanRequest.find(query)
      .populate('userId', 'name email cnic phoneNumber address')
      .populate('guarantors')
      .sort({ createdAt: -1 });

    // Filter by city/country if provided
    let filteredApplications = applications;
    if (city || country) {
      filteredApplications = applications.filter(app => {
        if (city && app.userId.address?.city?.toLowerCase() !== city.toLowerCase()) {
          return false;
        }
        if (country && app.userId.address?.country?.toLowerCase() !== country.toLowerCase()) {
          return false;
        }
        return true;
      });
    }

    res.json(filteredApplications);
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get application statistics
const getApplicationStats = async (req, res) => {
  try {
    const totalApplications = await LoanRequest.countDocuments();
    const pendingApplications = await LoanRequest.countDocuments({ status: 'pending' });
    const approvedApplications = await LoanRequest.countDocuments({ status: 'approved' });
    const rejectedApplications = await LoanRequest.countDocuments({ status: 'rejected' });

    // Get total loan amount
    const loanAmounts = await LoanRequest.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$loanAmount' }
        }
      }
    ]);

    res.json({
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalLoanAmount: loanAmounts[0]?.totalAmount || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'under-review', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const loanRequest = await LoanRequest.findById(id);
    if (!loanRequest) {
      return res.status(404).json({ message: 'Loan request not found' });
    }

    loanRequest.status = status;
    await loanRequest.save();

    res.json({
      message: 'Application status updated successfully',
      loanRequest
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Assign token number and schedule appointment
const assignTokenAndAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, appointmentTime, officeLocation } = req.body;

    const loanRequest = await LoanRequest.findById(id);
    if (!loanRequest) {
      return res.status(404).json({ message: 'Loan request not found' });
    }

    // Generate token if not already assigned
    if (!loanRequest.tokenNumber) {
      loanRequest.tokenNumber = generateTokenNumber();
    }

    // Update appointment details
    if (appointmentDate) loanRequest.appointmentDate = new Date(appointmentDate);
    if (appointmentTime) loanRequest.appointmentTime = appointmentTime;
    if (officeLocation) loanRequest.officeLocation = officeLocation;

    // Update status to under-review
    if (loanRequest.status === 'pending') {
      loanRequest.status = 'under-review';
    }

    await loanRequest.save();

    res.json({
      message: 'Token and appointment assigned successfully',
      loanRequest
    });
  } catch (error) {
    console.error('Assign token error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get application by token number
const getApplicationByToken = async (req, res) => {
  try {
    const { tokenNumber } = req.params;

    const loanRequest = await LoanRequest.findOne({ tokenNumber })
      .populate('userId', 'name email cnic phoneNumber address')
      .populate('guarantors');

    if (!loanRequest) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(loanRequest);
  } catch (error) {
    console.error('Get by token error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllApplications,
  getApplicationStats,
  updateApplicationStatus,
  assignTokenAndAppointment,
  getApplicationByToken
};
