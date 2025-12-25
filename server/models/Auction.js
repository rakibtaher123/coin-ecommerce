const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    productImage: { type: String },
    category: { type: String },
    basePrice: { type: Number, required: true },
    highestBid: { type: Number, default: 0 },
    totalBids: { type: Number, default: 0 },
    bids: [{
      userId: { type: String },
      userEmail: { type: String, required: true },
      userName: { type: String },
      amount: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now }
    }],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, default: "Upcoming" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", auctionSchema);
