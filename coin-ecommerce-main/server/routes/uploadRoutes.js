const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Return relative path for frontend usage
        // e.g., /assets/17000000-filename.jpg
        const imagePath = `/assets/${req.file.filename}`;

        res.json({
            success: true,
            imagePath: imagePath
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Image upload failed" });
    }
});

module.exports = router;
