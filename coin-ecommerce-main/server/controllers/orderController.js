const Order = require("../models/Order");

// ১. নতুন অর্ডার তৈরি করা (Create New Order)
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: "No order items" });
    return;
  } else {
    try {
      const order = new Order({
        orderItems,
        user: req.user._id, // লগইন করা ইউজার আইডি
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        status: "Pending" // ডিফল্ট স্ট্যাটাস
      });

      const createdOrder = await order.save();

      // 🔥 SOCKET.IO NOTIFICATION 🔥
      // Access global io instance if attached to req or via global variable if possible.
      // Since io is defined in index.js and not easily global here without export, we can check.
      // NOTE: User's index.js does NOT export io. 
      // To fix this cleanly, we usually attach io to req in middleware.
      // FOR NOW: I will assumme I can't access `io` easily unless I edit index.js more.
      // WAIT! In Step 381 index.js, `io` is local constant.
      // I should modify index.js to attach io to req.

      // Let's modify this controller assuming req.io exists (I will add it to index.js next).
      if (req.io) {
        req.io.emit("new_order", {
          message: "New Order Placed!",
          orderId: createdOrder._id,
          user: req.user.name,
          amount: totalPrice
        });
        console.log("🔔 Socket notification sent for new order.");
      }

      res.status(201).json(createdOrder);
    } catch (error) {
      console.error("Order Create Error:", error);
      res.status(500).json({ message: "Order creation failed" });
    }
  }
};

// ২. সব অর্ডার দেখা (Admin View)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ৩. নিজের অর্ডার দেখা (Client View)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your orders" });
  }
};

module.exports = { addOrderItems, getOrders, getMyOrders };