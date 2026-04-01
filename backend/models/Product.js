const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    botanicalName: { type: String },
    sanskritName: { type: String },
    category: { type: String, required: true },
    partUsed: { type: String },
    forms: [{ type: String }], // raw, powder, extract
    description: { type: String },
    uses: { type: String },
    directionsForUse: { type: String },
    sizes: [{ type: String }],
    bulkAvailability: { type: Boolean, default: true },
    images: [{
        url: { type: String },
        public_id: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
