const Order = require('../models/Order');

// ✅ Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// ✅ Create order
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "✅ Order created successfully", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

// ✅ Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ message: "✅ Order status updated", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};

// ✅ Delete order
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
};
