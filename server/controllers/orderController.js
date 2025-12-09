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

module.exports = { addOrderItems, getOrders };