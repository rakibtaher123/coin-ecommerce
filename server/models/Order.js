const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  totalPrice: Number,
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
