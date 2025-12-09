const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ✅ Token Generator
const genToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallbackSecretKey", {
    expiresIn: '30d',
  });
};

// ---------------------------
//        REGISTER
// ---------------------------
router.post('/register', async (req, res) => {
  try {
    console.log("📝 Register request received:", req.body);

    const { name, email, password, passwordConfirm, role } = req.body;

    // Validation
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ success: false, message: "সব ফিল্ড পূরণ করুন" });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ success: false, message: "পাসওয়ার্ড মিলছে না" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" });
    }

    const emailLower = email.toLowerCase();
    const existing = await User.findOne({ email: emailLower });
    if (existing) {
      return res.status(409).json({ success: false, message: "ইমেইল ইতিমধ্যে ব্যবহৃত হয়েছে" });
    }

    // Role condition: admin signup disallowed
    if (role === "admin") {
      return res.status(403).json({ success: false, message: "Admin account signup অনুমোদিত নয়। শুধু client signup করতে পারবে।" });
    }

    // Create User (hashing handled in User model pre-save hook)
    const user = await User.create({
      name,
      email: emailLower,
      password,
      role: "client" // force client role
    });

    const token = genToken(user._id);

    console.log("✅ User created successfully:", user.email);

    return res.status(201).json({
      success: true,
      message: "সাইনআপ সফল",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("❌ Signup Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "ইমেইল ইতিমধ্যে ব্যবহৃত হয়েছে" });
    }

    return res.status(500).json({
      success: false,
      message: "সার্ভার এরর: সাইনআপ সম্পন্ন করা যায়নি",
      error: error.message
    });
  }
});

// ---------------------------
//         LOGIN
// ---------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "ইমেইল এবং পাসওয়ার্ড দিন" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "ভুল ইমেইল বা পাসওয়ার্ড" });
    }

    const isMatch = typeof user.matchPassword === "function"
      ? await user.matchPassword(password)
      : await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "ভুল ইমেইল বা পাসওয়ার্ড" });
    }

    const token = genToken(user._id);

    return res.json({
      success: true,
      message: "লগিন সফল",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "সার্ভার এরর",
      error: error.message
    });
  }
});

module.exports = router;
