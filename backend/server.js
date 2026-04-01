require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const productRoutes = require('./routes/productRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security headers
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
// FRONTEND_URLS accepts a comma-separated list of allowed origins.
// Example on Render: FRONTEND_URLS=https://sdhcbaroda.netlify.app
// Multiple: FRONTEND_URLS=https://sdhcbaroda.netlify.app,https://www.sdhcbaroda.com
const rawOrigins = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '';
const productionOrigins = rawOrigins
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    ...productionOrigins,
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (curl, Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        console.warn(`CORS blocked: ${origin}`);
        callback(new Error(`CORS: Origin "${origin}" not allowed.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Explicitly handle OPTIONS preflight for all routes
app.options('*', cors(corsOptions));
// ─────────────────────────────────────────────────────────────────────────────

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Global rate limiter (100 req / 15 min per IP)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please slow down.' }
});
app.use('/api', globalLimiter);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Error Handling Middleware
app.use(errorHandler);

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
