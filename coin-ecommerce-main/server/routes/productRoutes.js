const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// ১. আপলোড মিডলওয়্যার ইমপোর্ট
const upload = require('../middleware/upload');

// 🔐 আমাদের তৈরি করা শক্তিশালী সিকিউরিটি চেক ইমপোর্ট করছি
// (verifyAdmin এর বদলে আমরা এই দুটি ব্যবহার করব)
const { protect, admin } = require('../middleware/authMiddleware'); 

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

// ✅ POST: নতুন প্রোডাক্ট যোগ করা (Admin Only)
// protect = লগইন চেক করবে, admin = রোল চেক করবে
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    console.log('🔵 Product POST request received:', { body: req.body, file: req.file });
    const { name, category, price, description, stock } = req.body;

    // ইমেজ হ্যান্ডলিং
    let imagePath = req.body.image || "";
    if (req.file) {
      imagePath = `/assets/${req.file.filename}`;
    }

    // ভ্যালিডেশন
    if (!name || !category || !price) {
      return res.status(400).json({ error: "Name, Category and Price are required" });
    }

    const newProduct = new Product({
      name,
      category,
      price,
      description,
      image: imagePath,
      stock: stock || 0
    });

    await newProduct.save();

    res.status(201).json({
      message: "✅ Product added successfully!",
      product: newProduct
    });
  } catch (err) {
    console.error("❌ Error adding product:", err.message);
    res.status(500).json({ error: `Failed to add product: ${err.message}` });
  }
});

// ✅ PUT: প্রোডাক্ট আপডেট করা (Admin Only)
// এখানে verifyAdmin এর বদলে protect, admin ব্যবহার করা হলো
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const productId = req.params.id;
    
    // আগের প্রোডাক্ট খুঁজে বের করা (ছবি ডিলিট করার লজিকের জন্য)
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    let updateData = { ...req.body };

    // যদি নতুন ছবি আপলোড হয়
    if (req.file) {
      updateData.image = `/assets/${req.file.filename}`;

      // 🧹 পুরনো ছবি ডিলিট করার লজিক (তোমার আগের কোড থেকেই রাখা)
      if (product.image && product.image.startsWith('/assets/')) {
        const oldFilePath = path.join(__dirname, '../public', product.image);
        if (fs.existsSync(oldFilePath)) {
           fs.unlinkSync(oldFilePath);
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "✅ Product updated successfully!",
      product: updatedProduct
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// ✅ DELETE: প্রোডাক্ট ডিলিট করা (Admin Only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // সার্ভার ফোল্ডার থেকে ছবি ডিলিট করা
    if (product.image && product.image.startsWith('/assets/')) {
      const filePath = path.join(__dirname, '../public', product.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
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