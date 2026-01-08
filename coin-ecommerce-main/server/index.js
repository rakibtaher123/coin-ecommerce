const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const fs = require('fs');
const cors = require("cors");
const http = require("http"); // Import HTTP
const { Server } = require("socket.io"); // Import Socket.io
const { connectDB } = require("./config/db");

// Models
const Product = require("./models/Product");
const Order = require("./models/Order");
const User = require("./models/User");
const Auction = require("./models/Auction"); // Import Auction Model

// ✅ 1. ENV Config
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ✅ ENV Validation
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI missing in .env file!");
  process.exit(1);
}

const app = express();
const server = http.createServer(app); // Create HTTP Server

// ✅ 2. Middleware
const corsOptions = {
  origin: true, // Allow all origins for simplicity in dev, or specify ["http://localhost:5173", "http://localhost:5174"]
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for development
    methods: ["GET", "POST"],
  },
});

// ✅ Make io accessible to our router
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log(`🔌 User Connected: ${socket.id}`);

  // 1. Join Specific Auction Room
  socket.on("join_auction", (auctionId) => {
    socket.join(auctionId);
    console.log(`User ${socket.id} joined Auction Room: ${auctionId}`);
  });

  // 2. Handle Bid Placement
  socket.on("place_bid", async (data) => {
    const { auctionId, userId, userName, bidAmount } = data;

    try {
      // Find the auction
      const auction = await Auction.findById(auctionId);

      if (auction) {
        // Validate Bid
        if (bidAmount > auction.currentPrice) {
          // Update DB
          auction.currentPrice = bidAmount;
          auction.highestBidder = userId;

          // Add to bid history
          auction.bids.push({
            user: userId,
            amount: bidAmount,
            time: new Date()
          });

          await auction.save();

          // Broadcast to everyone in this room
          io.to(auctionId).emit("receive_bid", {
            highestBid: bidAmount,
            lastBidder: userName,
            bidHistory: auction.bids.map(b => ({
              user: b.user === userId ? userName : "User", // Simplified name logic
              amount: b.amount,
              time: b.time
            })).reverse() // Show latest first
          });

          console.log(`✅ Bid accepted: ${bidAmount} by ${userName} for ${auctionId}`);
        } else {
          // Optional: Emit error back to sender
          socket.emit("bid_error", { message: "Bid must be higher than current price!" });
        }
      }
    } catch (err) {
      console.error("Socket Bid Error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// ✅ 3. Static Assets
const assetsPath = path.join(__dirname, '../public/assets');
app.use('/assets', express.static(assetsPath));

// Also serve the root public folder to catch other paths if needed
const publicPath = path.join(__dirname, '../public');
app.use('/public', express.static(publicPath));

// ===============================
// ✅ 4. Database Connection
// ===============================
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
  }
})();

// ===============================
// ✅ 5. API Routes
// ===============================

// ✅ Client Dashboard Stats (for logged-in users)
const { protect } = require("./middleware/authMiddleware");

app.get("/api/client/dashboard-stats", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const mongoose = require('mongoose');

    // Ensure userId is ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    console.log(`📊 Fetching dashboard stats for user: ${userId}`);

    const [totalOrders, pendingOrders, completedOrders, spentResult] =
      await Promise.all([
        Order.countDocuments({ user: userObjectId }),
        Order.countDocuments({ user: userObjectId, status: { $in: ['Pending', 'Processing'] } }),
        Order.countDocuments({ user: userObjectId, status: 'Delivered' }),
        Order.aggregate([
          { $match: { user: userObjectId } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ])
      ]);

    const totalSpent = spentResult.length > 0 ? spentResult[0].total : 0;

    console.log(`📊 Stats - Total: ${totalOrders}, Pending: ${pendingOrders}, Completed: ${completedOrders}, Spent: ${totalSpent}`);

    res.json({
      success: true,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSpent
    });

  } catch (err) {
    console.error("Client Dashboard Stats Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Dashboard Stats
app.get("/api/dashboard-stats", async (req, res) => {
  try {
    const [totalProducts, totalOrders, pendingOrders, totalUsers, incomeResult] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        Order.countDocuments({ status: "Pending" }),
        User.countDocuments({ role: { $ne: 'admin' } }), // Count all non-admin users
        Order.aggregate([
          { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ])
      ]);

    const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;

    res.json({
      success: true,
      totalProducts,
      totalOrders,
      pendingOrders,
      totalIncome,
      totalUsers
    });

  } catch (err) {
    console.error("Dashboard Stats Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Other Routes
try {
  app.use("/api/products", require("./routes/productRoutes"));
  app.use("/api/orders", require("./routes/orderRoutes"));
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/payment", require("./routes/paymentRoutes"));
  app.use("/api/auctions", require("./routes/auctionRoute"));
  app.use("/api/bids", require("./routes/bidRoute"));
  app.use("/api/upload", require("./routes/uploadRoutes")); // ✅ Upload Route
  app.use("/api/demo-archives", require("./routes/demoArchiveRoutes")); // ✅ Demo Archives Route

  const feedbackPath = path.join(__dirname, "./routes/feedbackRoutes.js");
  if (fs.existsSync(feedbackPath)) {
    app.use("/api/feedback", require("./routes/feedbackRoutes"));
  }

} catch (error) {
  console.error("❌ Route Import Error:", error.message);
}

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("✅ API is Running...");
});

// ✅ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: "File too large! Max size 5MB" });
  }
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// ✅ 6. Server Start (Use 'server' instead of 'app')
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Socket.io Server running on port ${PORT}`);
});
