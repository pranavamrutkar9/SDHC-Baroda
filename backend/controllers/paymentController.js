const crypto = require('crypto');
const Order = require('../models/Order');

/**
 * MOCK PAYMENT CONTROLLER
 * -------------------------------------------
 * Razorpay is not yet configured. This mock simulates
 * the full payment flow so the UI works end-to-end.
 *
 * When you are ready to go live:
 * 1. Run: npm install razorpay  (in backend/)
 * 2. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env
 * 3. Uncomment the Razorpay blocks and remove the mock blocks below.
 * -------------------------------------------
 */

// ---- TO ENABLE REAL RAZORPAY: uncomment and fill in ----
// const Razorpay = require('razorpay');
// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// });
// --------------------------------------------------------

// POST /api/payment/create-order  [authUser]
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found.' });
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        // ---- MOCK PAYMENT RESPONSE (remove when using real Razorpay) ----
        const mockRazorpayOrderId = `mock_order_${Date.now()}`;
        return res.json({
            id: mockRazorpayOrderId,
            amount: Math.round(order.totalPrice * 100),
            currency: 'INR',
            mock: true // frontend will detect this and skip Razorpay SDK
        });
        // ------------------------------------------------------------------

        /* ---- REAL RAZORPAY (uncomment when ready) ----
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(order.totalPrice * 100), // paise
            currency: 'INR',
            receipt: `order_${orderId}`
        });
        return res.json(razorpayOrder);
        ------------------------------------------------ */
    } catch (error) {
        console.error('createRazorpayOrder error:', error);
        res.status(500).json({ message: 'Payment initiation failed.' });
    }
};

// POST /api/payment/verify  [authUser]
exports.verifyPayment = async (req, res) => {
    try {
        const {
            orderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            mock
        } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found.' });

        if (mock) {
            // ---- MOCK: skip signature verification ----
            order.isPaid = true;
            order.paidAt = new Date();
            order.orderStatus = 'Processing';
            order.paymentResult = {
                razorpay_order_id: razorpay_order_id || 'mock',
                razorpay_payment_id: razorpay_payment_id || `mock_pay_${Date.now()}`,
                razorpay_signature: 'mock_signature',
                status: 'mock_success'
            };
            await order.save();
            return res.json({ success: true, order });
        }

        /* ---- REAL RAZORPAY VERIFICATION (uncomment when ready) ----
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
        }

        order.isPaid = true;
        order.paidAt = new Date();
        order.orderStatus = 'Processing';
        order.paymentResult = { razorpay_order_id, razorpay_payment_id, razorpay_signature, status: 'success' };
        await order.save();
        return res.json({ success: true, order });
        ----------------------------------------------------------- */
    } catch (error) {
        console.error('verifyPayment error:', error);
        res.status(500).json({ message: 'Payment verification failed.' });
    }
};
