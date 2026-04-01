const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => {
    return jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// POST /api/users/register
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        const user = new User({ name, email: email.toLowerCase(), password, phone });
        await user.save();

        const token = signToken(user);

        res.status(201).json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        });
    } catch (error) {
        console.error('registerUser error:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// POST /api/users/login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = signToken(user);

        res.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        });
    } catch (error) {
        console.error('loginUser error:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// GET /api/users/profile  [protected]
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// PUT /api/users/profile  [protected]
exports.updateUserProfile = async (req, res) => {
    try {
        const { name, phone, addresses } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (addresses) user.addresses = addresses;

        // If password update is requested
        if (req.body.newPassword) {
            if (!req.body.currentPassword) {
                return res.status(400).json({ message: 'Current password is required to set a new password.' });
            }
            const userWithPw = await User.findById(req.user.id).select('+password');
            const isMatch = await userWithPw.comparePassword(req.body.currentPassword);
            if (!isMatch) return res.status(401).json({ message: 'Incorrect current password.' });
            user.password = req.body.newPassword;
        }

        await user.save();
        res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, addresses: user.addresses });
    } catch (error) {
        console.error('updateUserProfile error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
