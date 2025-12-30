const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  // আগে ছিল 'stock', এখন 'countInStock' করা হলো যাতে অন্য ফাইলের সাথে মিলে যায়
  countInStock: { 
    type: Number, 
    required: true,
    default: 10 
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);