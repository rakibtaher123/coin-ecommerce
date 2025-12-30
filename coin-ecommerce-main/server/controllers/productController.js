const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// ১. সব প্রোডাক্ট দেখা (Public)
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ২. নতুন প্রোডাক্ট তৈরি (Admin Only)
exports.createProduct = async (req, res) => {
    try {
        const { name, category, price, description } = req.body;
        
        let imagePath = "";
        if (req.file) {
            imagePath = `/assets/${req.file.filename}`;
        }

        const newProduct = new Product({
            name,
            category,
            price,
            description,
            image: imagePath
        });

        await newProduct.save();
        res.status(201).json(newProduct);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create product" });
    }
};

// ৩. প্রোডাক্ট আপডেট (Admin Only) - এটি আগে ছিল না, নতুন যোগ করা হলো
exports.updateProduct = async (req, res) => {
    try {
        const { name, category, price, description } = req.body;
        const productId = req.params.id;

        // আগের প্রোডাক্ট খুঁজে বের করা
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // যদি নতুন ছবি আপলোড করা হয়
        let imagePath = product.image; // ডিফল্ট আগের ছবি
        if (req.file) {
            imagePath = `/assets/${req.file.filename}`;
            
            // পুরনো ছবি ডিলিট করা (অপশনাল, মেমোরি বাঁচানোর জন্য ভালো)
            if (product.image) {
                const oldPath = path.join(__dirname, '../public', product.image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        // ডাটা আপডেট করা
        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = imagePath;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update product" });
    }
};

// ৪. প্রোডাক্ট ডিলিট (Admin Only)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // ছবি ডিলিট করা
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