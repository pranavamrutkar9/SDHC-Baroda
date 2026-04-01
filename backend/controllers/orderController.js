const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /api/orders  [authUser]
exports.createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items provided.' });
        }

        // Fetch current prices from DB to prevent price manipulation
        const productIds = orderItems.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } });

        const validatedItems = orderItems.map(item => {
            const dbProduct = products.find(p => p._id.toString() === item.product);
            if (!dbProduct) throw new Error(`Product ${item.product} not found`);
            return {
                product: item.product,
                name: dbProduct.name,
                image: dbProduct.images?.[0]?.url || '',
                price: dbProduct.price || 0,
                qty: item.qty,
                size: item.size || ''
            };
        });

        const itemsPrice = validatedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
        const taxPrice = parseFloat((itemsPrice * 0.18).toFixed(2)); // 18% GST
        const shippingPrice = itemsPrice >= 500 ? 0 : 60; // Free shipping above ₹500
        const totalPrice = parseFloat((itemsPrice + taxPrice + shippingPrice).toFixed(2));

        const order = new Order({
            user: req.user.id,
            orderItems: validatedItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'Razorpay',
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const saved = await order.save();
        res.status(201).json(saved);
    } catch (error) {
        console.error('createOrder error:', error);
        res.status(400).json({ message: error.message || 'Failed to create order.' });
    }
};

// GET /api/orders/myorders  [authUser]
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('orderItems.product', 'name images');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/orders/:id  [authUser OR admin]
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) return res.status(404).json({ message: 'Order not found.' });

        // Allow access if: the requesting user owns the order, OR it's an admin request
        const isOwner = req.user && order.user._id.toString() === req.user.id;
        const isAdmin = req.admin; // set by admin auth middleware
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/orders  [admin only via auth middleware]
exports.getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status) filter.orderStatus = req.query.status;

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('user', 'name email phone'),
            Order.countDocuments(filter)
        ]);

        res.json({ orders, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// PUT /api/orders/:id/status  [admin only]
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: 'Invalid order status.' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found.' });

        order.orderStatus = orderStatus;
        if (orderStatus === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = new Date();
        }

        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};
