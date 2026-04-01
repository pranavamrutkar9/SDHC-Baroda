const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const productController = require('../controllers/productController');
const { validateProduct } = require('../middleware/validation');
const upload = require('../middleware/upload');

// Get all products (Public)
router.get('/', productController.getProducts);

// Get single product (Public)
router.get('/:id', productController.getProductById);

// Create product (Admin only)
router.post('/', auth, upload.array('images', 5), validateProduct, productController.createProduct);

// Update product (Admin only)
router.put('/:id', auth, upload.array('images', 5), validateProduct, productController.updateProduct);

// Delete product (Admin only)
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
