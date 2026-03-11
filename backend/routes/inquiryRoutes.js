const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const inquiryController = require('../controllers/inquiryController');
const { validateInquiry } = require('../middleware/validation');

// Submit inquiry (Public)
router.post('/', validateInquiry, inquiryController.submitInquiry);

// Get all inquiries (Admin only)
router.get('/', auth, inquiryController.getInquiries);

module.exports = router;
