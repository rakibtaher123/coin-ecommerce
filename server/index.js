const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const fs = require('fs');
const cors = require("cors");
const { connectDB } = require("./config/db");

// Models
const Product = require("./models/Product");
const Order = require("./models/Order");
const User = require("./models/User");

// ১. কনফিগারেশন লোড করা
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ENV ভ্যালিডেশন
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI missing in .env file!");
  process.exit(1);
}

const app = express();

// ২. মিডলওয়্যার সেটআপ
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// ৩. স্ট্যাটিক ফাইল
const assetsPath = path.resolve(__dirname, '../public/assets');
if (fs.existsSync(assetsPath)) {
    app.use('/assets', express.static(assetsPath));
}

// ===============================
// ✅ ৪. ডাটাবেস কানেকশন (কোনো ফেইক অর্ডার জেনারেটর নেই)
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
// ✅ ৫. API রুটস
// ===============================

// Dashboard Stats API
app.get("/api/dashboard-stats", async (req, res) => {
  try {
    const [totalProducts, totalOrders, pendingOrders, totalUsers, incomeResult] = await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        Order.countDocuments({ status: "Pending" }), 
        User.countDocuments({ role: 'user' }),
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

// Routes Import
try {
    app.use("/api/products", require("./routes/productRoutes"));
    app.use("/api/orders", require("./routes/orderRoutes"));
    app.use("/api/auth", require("./routes/authRoutes")); // এই লাইনে যেন ভুল না থাকে
    
    // Feedback Route
    const feedbackPath = path.join(__dirname, "./routes/feedbackRoutes.js");
    if (fs.existsSync(feedbackPath)) {
        app.use("/api/feedback", require("./routes/feedbackRoutes"));
    }
} catch (error) {
    console.error("❌ Route Import Error:", error.message);
}

// Health Check
app.get("/", (req, res) => {
  res.send("API is Running...");
});

// ৬. সার্ভার চালু করা
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});