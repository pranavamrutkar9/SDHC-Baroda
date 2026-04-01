const express = require('express');
const router = express.Router();
const authUser = require('../middleware/authUser');
const auth = require('../middleware/auth'); // admin middleware
const orderController = require('../controllers/orderController');

// POST /api/orders — create order (customer)
router.post('/', authUser, orderController.createOrder);

// GET /api/orders/myorders — my orders (customer)
router.get('/myorders', authUser, orderController.getMyOrders);

// GET /api/orders — all orders (admin)
router.get('/', auth, orderController.getAllOrders);

// GET /api/orders/:id — single order (customer owns it OR admin)
// We attach both possible middlewares but let the controller decide access
router.get('/:id', (req, res, next) => {
    // Try user token first, then admin token
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization required.' });

    const jwt = require('jsonwebtoken');
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Could be user or admin token
        if (decoded.email) {
            req.user = decoded; // customer token has email
        } else {
            req.admin = decoded; // admin token has username
        }
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token.' });
    }
}, orderController.getOrderById);

// PUT /api/orders/:id/status — update status (admin)
router.put('/:id/status', auth, orderController.updateOrderStatus);

module.exports = router;
