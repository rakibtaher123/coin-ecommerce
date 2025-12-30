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
    basePrice: { type: Number }, // Original price before bidding stats

    // ✅ New Fields for Jain Auction Style
    lotNumber: { type: String, required: true },
    minEstimate: { type: Number, required: true },
    maxEstimate: { type: Number, required: true },
    incrementAmount: { type: Number, default: 100 },

    currentPrice: { type: Number, default: function () { return this.startingPrice; } },

    highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    bids: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      amount: { type: Number, required: true },
      time: { type: Date, default: Date.now }
    }],

    // Final auction results
    finalPrice: { type: Number }, // Final sold price when auction closes
    soldDate: { type: Date }, // When auction was closed/sold

    status: {
      type: String,
      enum: ['active', 'closed', 'sold'],
      default: 'active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", auctionSchema);
