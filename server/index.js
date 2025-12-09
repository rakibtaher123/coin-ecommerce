const dotenv = require("dotenv");
const path = require("path");
const fs = require('fs');

// .env ফাইল লোড করা
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const { connectDB, getConnectionStatus } = require("./config/db");

// Models ইমপোর্ট
const Product = require("./models/Product");
const Order = require("./models/Order");
const User = require("./models/User");

// ENV চেক
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI missing in .env file!");
  process.exit(1);
}

// ডাটাবেস কানেকশন
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
  }
})();

const app = express();

// ===============================
// ✅ CORS SETUP (UNIVERSAL & STABLE)
// ===============================
const corsOptions = {
  origin: (origin, callback) => {
    // ১. মোবাইল অ্যাপ বা পোস্টম্যান
    if (!origin) return callback(null, true);
    
    // ২. যেকোনো লোকালহোস্ট এবং পোর্ট এলাও (5173, 5179, 5180 সব চলবে)
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }

    // ৩. আপনার লাইভ ডোমেইন
    if (origin === 'https://coinhousemarket.com') {
      return callback(null, true);
    }

    // ৪. অন্যথায় ব্লক
    return callback(new Error('Not allowed by CORS')); 
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS Middleware
app.use(cors(corsOptions)); 

// ✅ FINAL FIX: Pre-flight (OPTIONS) requests হ্যান্ডেল করার জন্য
// এই লাইনটিই আপনার আগের 'PathError' সমস্যার আসল ফিক্স।
app.options(/.*/, cors(corsOptions)); 

app.use(express.json());

// ✅ ইমেজ ফোল্ডার সেটআপ
const assetsPath = path.resolve(__dirname, '../public/assets');
if (fs.existsSync(assetsPath)) {
    app.use('/assets', express.static(assetsPath));
} else {
    console.warn("⚠️ Warning: 'public/assets' folder not found!");
}

// ===============================
// ✅ ROUTES SETUP
// ===============================
try {
    app.use("/api/products", require("./routes/productRoutes"));
    app.use("/api/orders", require("./routes/orderRoutes"));
    app.use("/api/auth", require("./routes/authRoutes"));
    
    const feedbackPath = path.join(__dirname, "./routes/feedbackRoutes.js");
    if (fs.existsSync(feedbackPath)) {
        app.use("/api/feedback", require("./routes/feedbackRoutes"));
    }
} catch (error) {
    console.error("❌ Route Import Error:", error.message);
}

// হেলথ চেক
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is Running", port: process.env.PORT || 5000 });
});

// ড্যাশবোর্ড স্ট্যাটাস
app.get("/api/dashboard-stats", async (req, res) => {
  try {
    const [totalProducts, totalOrders, pendingOrders, totalUsers] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        Order.countDocuments({ status: "Pending" }),
        User.countDocuments(),
      ]);

    const incomeResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalIncome = incomeResult[0]?.total || 0;

    res.json({ totalProducts, totalOrders, pendingOrders, totalIncome, totalUsers });
  } catch (err) {
    console.error("Dashboard Stats Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// গ্লোবাল এরর হ্যান্ডলার
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});