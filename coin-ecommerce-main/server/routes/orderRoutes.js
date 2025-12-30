const express = require("express");
const router = express.Router();
const { addOrderItems, getOrders, getMyOrders } = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware"); // অথেন্টিকেশন মিডলওয়্যার

// ১. অর্ডার তৈরি (লগইন করা ইউজার পারবে)
router.route("/").post(protect, addOrderItems);

// ৩. নিজের অর্ডার দেখা (Client View)
router.route("/myorders").get(protect, getMyOrders);

// ২. সব অর্ডার দেখা (শুধুমাত্র অ্যাডমিন পারবে)
router.route("/").get(protect, admin, getOrders);

module.exports = router;