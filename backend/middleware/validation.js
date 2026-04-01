const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateProduct = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('category').isIn(['Raw Herbs', 'Herbal Powders', 'Extracts', 'Oils & Resins']).withMessage('Invalid category'),
    body('bulkAvailability').isBoolean().withMessage('Bulk availability must be a boolean'),
    handleValidationErrors
];

const validateAdminLogin = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

const validateAdminCreate = [
    body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    handleValidationErrors
];

const validateAdminUpdatePassword = [
    body('currentPassword').trim().notEmpty().withMessage('Current password is required'),
    body('newPassword').trim().notEmpty().withMessage('New password is required').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
    handleValidationErrors
];

const validateInquiry = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('materialRequired').trim().notEmpty().withMessage('Material required is required'),
    body('quantity').trim().notEmpty().withMessage('Quantity is required'),
    handleValidationErrors
];

const validateUserRegister = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim(),
    handleValidationErrors
];

const validateUserLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

module.exports = {
    validateProduct,
    validateAdminLogin,
    validateAdminCreate,
    validateAdminUpdatePassword,
    validateInquiry,
    validateUserRegister,
    validateUserLogin
};
