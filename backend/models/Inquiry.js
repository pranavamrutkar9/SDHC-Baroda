const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    organization: { type: String },
    materialRequired: { type: String, required: true },
    quantity: { type: String, required: true },
    location: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
