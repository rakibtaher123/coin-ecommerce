const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // কনসোলে প্রিন্ট করে দেখি টোকেন ডিকোড হচ্ছে কিনা
      // console.log("Decoded Token ID:", decoded.id); 

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  // 👇 এই লগগুলো আমাদের আসল সত্যিটা বলে দেবে
  console.log("--------------- ADMIN CHECK ---------------");
  console.log("User Email:", req.user?.email);
  console.log("User Role from DB:", req.user?.role);
  console.log("Is Admin matches?:", req.user?.role === 'admin');
  console.log("-------------------------------------------");

  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // লক্ষ্য করো, আমি মেসেজটা একটু বদলে দিচ্ছি বোঝার জন্য যে এই ফাইলটাই কাজ করছে
    res.status(401).json({ message: 'Backend says: You are NOT an admin!' });
  }
};

module.exports = { protect, admin };