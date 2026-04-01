const express = require('express');
const router = express.Router();
const authUser = require('../middleware/authUser');
const paymentController = require('../controllers/paymentController');

// POST /api/payment/create-order
router.post('/create-order', authUser, paymentController.createRazorpayOrder);

// POST /api/payment/verify
router.post('/verify', authUser, paymentController.verifyPayment);

module.exports = router;
