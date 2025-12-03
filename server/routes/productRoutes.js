const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

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

// ✅ POST: নতুন প্রোডাক্ট যোগ করা (admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, category, price, description, image, stock } = req.body;

    if (!name || !category || !price || !description || !image || !stock) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newProduct = new Product({ name, category, price, description, image, stock });
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
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
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

// ✅ DELETE: প্রোডাক্ট ডিলিট করা (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "✅ Deleted Successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
