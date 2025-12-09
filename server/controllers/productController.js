const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// সব প্রোডাক্ট দেখা
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ নতুন প্রোডাক্ট তৈরি (Create)
exports.createProduct = async (req, res) => {
    try {
        const { name, category, price, description } = req.body;
        
        // ছবি আপলোড হলে তার পাথ সেট হবে, না হলে ডিফল্ট কিছু থাকবে
        let imagePath = "";
        if (req.file) {
            imagePath = `/assets/${req.file.filename}`;
        }

        const newProduct = new Product({
            name,
            category,
            price,
            description, // যদি মডেলে থাকে
            image: imagePath // ইমেজের পাথ সেভ হলো
        });

        await newProduct.save();
        res.status(201).json(newProduct);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create product" });
    }
};

// ✅ প্রোডাক্ট ডিলিট (Delete)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // অপশনাল: সার্ভার থেকে ছবির ফাইল ডিলিট করা
        if (product.image) {
            const filePath = path.join(__dirname, '../public', product.image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete product" });
    }
};