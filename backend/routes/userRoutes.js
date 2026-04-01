const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authUser = require('../middleware/authUser');
const userController = require('../controllers/userController');
const { validateUserRegister, validateUserLogin } = require('../middleware/validation');

// Rate limit auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});

// POST /api/users/register
router.post('/register', authLimiter, validateUserRegister, userController.registerUser);

// POST /api/users/login
router.post('/login', authLimiter, validateUserLogin, userController.loginUser);

// GET /api/users/profile
router.get('/profile', authUser, userController.getUserProfile);

// PUT /api/users/profile
router.put('/profile', authUser, userController.updateUserProfile);

module.exports = router;
