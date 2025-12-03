const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  image: String,
  stock: Number
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
