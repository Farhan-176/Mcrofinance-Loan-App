const express = require('express');
const router = express.Router();
const {
  getAllApplications,
  getApplicationStats,
  updateApplicationStatus,
  assignTokenAndAppointment,
  getApplicationByToken
} = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// All routes require admin authentication
router.use(authMiddleware, adminMiddleware);

router.get('/applications', getAllApplications);
router.get('/stats', getApplicationStats);
router.put('/application/:id/status', updateApplicationStatus);
router.post('/application/:id/assign', assignTokenAndAppointment);
router.get('/application/token/:tokenNumber', getApplicationByToken);

module.exports = router;
