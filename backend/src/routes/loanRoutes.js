const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const {
  getLoanCategories,
  calculateLoanEstimate,
  createLoanRequest,
  addGuarantors,
  getUserLoanRequests,
  getLoanRequest,
  generateSlip,
  uploadDocuments
} = require('../controllers/loanController');
const { authMiddleware } = require('../middleware/auth');

// Configure uploads directory
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({ storage });

// Public routes
router.get('/categories', getLoanCategories);
router.post('/calculate', calculateLoanEstimate);

// Protected routes
router.post('/request', authMiddleware, createLoanRequest);
router.post('/request/:loanRequestId/guarantors', authMiddleware, addGuarantors);
router.post(
  '/request/:loanRequestId/documents',
  authMiddleware,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'cnicFront', maxCount: 1 },
    { name: 'cnicBack', maxCount: 1 }
  ]),
  uploadDocuments
);
router.get('/requests', authMiddleware, getUserLoanRequests);
router.get('/request/:id', authMiddleware, getLoanRequest);
router.get('/slip/:loanRequestId', authMiddleware, generateSlip);

module.exports = router;
