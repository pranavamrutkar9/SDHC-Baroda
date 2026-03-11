const Inquiry = require('../models/Inquiry');

// Submit inquiry (Public)
exports.submitInquiry = async (req, res) => {
    try {
        const inquiry = new Inquiry(req.body);
        const savedInquiry = await inquiry.save();
        res.status(201).json({ message: 'Inquiry submitted successfully', inquiry: savedInquiry });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all inquiries (Admin only)
exports.getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
