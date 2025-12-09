const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// ১. আপলোড মিডলওয়্যার ইমপোর্ট (আগের ধাপে বানানো ফাইলটি)
const upload = require('../middleware/upload'); 

// 🔐 Middleware: Admin check
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

// ✅ GET: সব প্রোডাক্ট দেখানো (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); 
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ GET: নির্দিষ্ট প্রোডাক্ট দেখানো (by ID, public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// ✅ POST: নতুন প্রোডাক্ট যোগ করা (With Image Upload)
// upload.single('image') এখানে ফাইল রিসিভ করবে
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, description, stock } = req.body;

    // ইমেজ হ্যান্ডলিং: ফাইল থাকলে পাথে '/assets/filename', না থাকলে ইউজার ইনপুট (URL)
    let imagePath = req.body.image || ""; 
    if (req.file) {
        imagePath = `/assets/${req.file.filename}`;
    }

    // ভ্যালিডেশন (স্টক বাদে বাকিগুলো চেক করা হলো, স্টক অপশনাল হতে পারে)
    if (!name || !category || !price) {
      return res.status(400).json({ error: "Name, Category and Price are required" });
    }

    const newProduct = new Product({ 
        name, 
        category, 
        price, 
        description, 
        image: imagePath, 
        stock: stock || 0 // স্টক না দিলে ০
    });
    
    await newProduct.save();

    res.status(201).json({
      message: "✅ Product added successfully!",
      product: newProduct
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// ✅ PUT: প্রোডাক্ট আপডেট করা (admin only)
router.put('/:id', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const productId = req.params.id;
    let updateData = { ...req.body };

    // যদি নতুন ছবি আপলোড হয়, তবে সেটা আপডেট হবে
    if (req.file) {
        updateData.image = `/assets/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "✅ Product updated successfully!",
      product: updatedProduct
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// ✅ DELETE: প্রোডাক্ট ডিলিট করা (সাথে ছবিও ডিলিট হবে)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // সার্ভার ফোল্ডার থেকে ছবি ডিলিট করা (যদি লোকাল ফাইল হয়)
    if (product.image && product.image.startsWith('/assets/')) {
        const filePath = path.join(__dirname, '../public', product.image); // public/assets ফোল্ডার পাথ
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // ফাইল ডিলিট
        }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "✅ Product and Image Deleted Successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;