const express = require("express");
const router = express.Router();
const { addOrderItems, getOrders, getMyOrders, getOrderById, deleteOrder, updateOrderStatus } = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware"); // অথেন্টিকেশন মিডলওয়্যার

// ১. অর্ডার তৈরি (লগইন করা ইউজার পারবে)
router.route("/").post(protect, addOrderItems);

// ৩. নিজের অর্ডার দেখা (Client View)
router.route("/myorders").get(protect, getMyOrders);

// ৪. নির্দিষ্ট অর্ডার দেখা এবং ডিলিট করা (ID দিয়ে)
router.route("/:id").get(protect, getOrderById).delete(protect, deleteOrder);

// ৫. অর্ডার স্ট্যাটাস আপডেট (Admin Only)
router.route("/:id/status").put(protect, admin, updateOrderStatus);

// ২. সব অর্ডার দেখা (শুধুমাত্র অ্যাডমিন পারবে)
router.route("/").get(protect, admin, getOrders);

module.exports = router;