const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const { validateAdminLogin, validateAdminCreate, validateAdminUpdatePassword } = require('../middleware/validation');

// Rate limit login attempts: 5 per 15 minutes per IP
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// POST /api/admin/login — Authenticate and return JWT
router.post('/login', loginLimiter, validateAdminLogin, adminController.login);

// GET /api/admin/me — Verify token and return admin info
router.get('/me', auth, adminController.getMe);

// POST /api/admin/seed — Create initial admin (only if none exists)
router.post('/seed', adminController.seedAdmin);

// GET /api/admin/all — Get all admins
router.get('/all', auth, adminController.getAllAdmins);

// POST /api/admin/create — Create new admin (requires auth)
router.post('/create', auth, validateAdminCreate, adminController.createAdmin);

// PUT /api/admin/:id/username
router.put('/:id/username', auth, adminController.updateUsername);

// PUT /api/admin/:id/password
router.put('/:id/password', auth, validateAdminUpdatePassword, adminController.updatePassword);

// DELETE /api/admin/:id
router.delete('/:id', auth, adminController.deleteAdmin);

module.exports = router;
