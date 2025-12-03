const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// 🔐 Middleware: Token check
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

// 🔐 Middleware: Admin check
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }
  next();
};

// ✅ POST: নতুন অর্ডার তৈরি (client)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { products, totalPrice, paymentMethod, deliveryMethod } = req.body;

    if (!products || !totalPrice || !paymentMethod || !deliveryMethod) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const newOrder = new Order({
      userId: req.user.id,
      products,
      totalPrice,
      paymentMethod,   // nagad / bkash / rocket
      deliveryMethod,  // courier
      status: "Pending"
    });

    await newOrder.save();

    res.status(201).json({ 
      message: "✅ Order placed successfully", 
      order: newOrder 
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// ✅ GET: সব অর্ডার দেখানো (admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email') // শুধু নাম ও ইমেইল দেখাবে
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
