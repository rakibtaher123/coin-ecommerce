const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    // Keeping snapshot fields for quick display without population
    productName: { type: String },
    productImage: { type: String },
    category: { type: String },

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    startingPrice: { type: Number, required: true },
    currentPrice: { type: Number, default: function () { return this.startingPrice; } },

    highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    bids: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      amount: { type: Number, required: true },
      time: { type: Date, default: Date.now }
    }],

    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", auctionSchema);
