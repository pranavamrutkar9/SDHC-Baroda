const jwt = require('jsonwebtoken');

/**
 * Customer auth middleware.
 * Sets req.user (not req.admin) to avoid conflict with existing admin auth.js
 */
const authUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, name, email, role }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
    }
};

module.exports = authUser;
