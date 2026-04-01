const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

const uploadImagesToCloudinary = async (files) => {
    if (!files || files.length === 0) return [];
    const uploadPromises = files.map(file => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'products' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve({ url: result.secure_url, public_id: result.public_id });
                }
            );
            uploadStream.end(file.buffer);
        });
    });
    return Promise.all(uploadPromises);
};

// Get all products (Public)
exports.getProducts = async (req, res) => {
    try {
        const query = {};
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { botanicalName: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        if (req.query.category) {
            query.category = req.query.category;
        }
        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single product (Public)
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
    try {
        const productData = { ...req.body };
        
        // Parse JSON arrays that were stringified by front-end
        if (typeof productData.forms === 'string') {
            try { productData.forms = JSON.parse(productData.forms); } catch (e) { productData.forms = []; }
        }
        if (typeof productData.sizes === 'string') {
            try { productData.sizes = JSON.parse(productData.sizes); } catch (e) { productData.sizes = []; }
        }
        if (typeof productData.bulkAvailability === 'string') {
            productData.bulkAvailability = productData.bulkAvailability === 'true';
        }

        const uploadedImages = await uploadImagesToCloudinary(req.files);
        if (uploadedImages.length > 0) {
            productData.images = uploadedImages;
        }

        const product = new Product(productData);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
    try {
        const productData = { ...req.body };
        
        // Parse JSON arrays that were stringified by front-end
        if (typeof productData.forms === 'string') {
            try { productData.forms = JSON.parse(productData.forms); } catch (e) { productData.forms = []; }
        }
        if (typeof productData.sizes === 'string') {
            try { productData.sizes = JSON.parse(productData.sizes); } catch (e) { productData.sizes = []; }
        }
        if (typeof productData.bulkAvailability === 'string') {
            productData.bulkAvailability = productData.bulkAvailability === 'true';
        }

        const uploadedImages = await uploadImagesToCloudinary(req.files);
        if (uploadedImages.length > 0) {
            // we have new images uploaded, we probably want to append or replace them.
            // for simplicity, let's just append or replace depending on logic.
            // Let's replace the images entirely if new images are uploaded.
            productData.images = uploadedImages;
        } else {
            // Keep existing images (if sending json data, check if we need to parse them)
            // But FormData doesn't easily maintain objects, so existing images might be lost, 
            // unless we receive them as a stringified json.
        }

        const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        // Optional: delete associated images from cloudinary
        if (product.images && product.images.length > 0) {
            for (let img of product.images) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
