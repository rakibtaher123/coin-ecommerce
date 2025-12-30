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

    const { name, email, password, passwordConfirm, phone, address, city, postalCode, role } = req.body;

    // Validation
    if (!name || !email || !password || !passwordConfirm || !phone || !address || !city || !postalCode) {
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
      phone,
      address,
      city,
      postalCode,
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
        phone: user.phone,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
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
        phone: user.phone,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
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

// ---------------------------
//      UPDATE PROFILE
// ---------------------------
router.put('/profile', async (req, res) => {
  try {
    const { id, name, password, image, phone, address, city, postalCode } = req.body;

    // Ensure user exists
    const user = await User.findById(id);

    if (user) {
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      user.city = city || user.city;
      user.postalCode = postalCode || user.postalCode;

      if (image) {
        user.image = image;
      }
      if (password) {
        user.password = password; // Pre-save hook will hash it
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          city: updatedUser.city,
          postalCode: updatedUser.postalCode,
          role: updatedUser.role,
          image: updatedUser.image
        },
        token: genToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ success: false, message: "Profile update failed" });
  }
});

// ---------------------------
//   USER MANAGEMENT (ADMIN)
// ---------------------------

// 1. GET ALL USERS (exclude admins)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error("❌ Get Users Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

// 2. GET SINGLE USER BY ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("❌ Get User Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

// 3. UPDATE USER ROLE
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    if (!['client', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'client' or 'user'"
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent changing admin role
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Cannot modify admin role"
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("❌ Update Role Error:", error);
    res.status(500).json({ success: false, message: "Failed to update user role" });
  }
});

// 4. DELETE USER
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent deleting admin accounts
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin account"
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("❌ Delete User Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

module.exports = router;
