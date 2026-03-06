const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// Rate limit login attempts: 5 per 15 minutes per IP
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// POST /api/admin/login — Authenticate and return JWT
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const admin = await Admin.findOne({ username: username.toLowerCase() });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, username: admin.username });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/admin/me — Verify token and return admin info
router.get('/me', auth, (req, res) => {
    res.json({ username: req.admin.username });
});

// POST /api/admin/seed — Create initial admin (only if none exists)
router.post('/seed', async (req, res) => {
    try {
        const existingAdmin = await Admin.findOne();
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin account already exists.' });
        }

        const admin = new Admin({
            username: 'admin',
            password: 'admin123'
        });
        await admin.save();

        res.status(201).json({ message: 'Admin account created successfully. Username: admin' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/admin/all — Get all admins
router.get('/all', auth, async (req, res) => {
    try {
        const admins = await Admin.find({}, '-password'); // exclude password
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/admin/create — Create new admin (requires auth)
router.post('/create', auth, async (req, res) => {
    try {
        if (req.admin.username !== 'admin') {
            return res.status(403).json({ message: 'Only the main admin can create new accounts.' });
        }

        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }

        const existing = await Admin.findOne({ username: username.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const admin = new Admin({ username: username.toLowerCase(), password });
        await admin.save();

        res.status(201).json({ message: 'Admin created successfully', admin: { _id: admin._id, username: admin.username } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin/:id/username
router.put('/:id/username', auth, async (req, res) => {
    try {
        if (req.admin.id !== req.params.id) {
            return res.status(403).json({ message: 'You can only update your own username.' });
        }

        const { newUsername } = req.body;
        if (!newUsername) return res.status(400).json({ message: 'New username required' });

        const existing = await Admin.findOne({ username: newUsername.toLowerCase() });
        if (existing && existing._id.toString() !== req.params.id) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        admin.username = newUsername.toLowerCase();
        await admin.save();

        res.json({ message: 'Username updated', admin: { _id: admin._id, username: admin.username } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin/:id/password
router.put('/:id/password', auth, async (req, res) => {
    try {
        if (req.admin.id !== req.params.id) {
            return res.status(403).json({ message: 'You can only update your own password.' });
        }

        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Both current and new passwords are required.' });
        }

        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const isMatch = await admin.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }

        admin.password = newPassword;
        await admin.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/admin/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.admin.username !== 'admin' && req.admin.id !== req.params.id) {
            return res.status(403).json({ message: 'You can only delete your own account.' });
        }

        const count = await Admin.countDocuments();
        if (count <= 1) {
            return res.status(400).json({ message: 'Cannot delete the last admin account.' });
        }

        const adminToDelete = await Admin.findById(req.params.id);
        if (!adminToDelete) {
            return res.status(404).json({ message: 'Admin not found.' });
        }

        if (adminToDelete.username === 'admin' && req.admin.username !== 'admin') {
            return res.status(403).json({ message: 'Cannot delete the main admin account.' });
        }

        await Admin.findByIdAndDelete(req.params.id);
        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
