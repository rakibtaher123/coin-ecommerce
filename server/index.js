// ===============================
// 1️⃣ Load Environment Variables
// ===============================
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ===============================
// 2️⃣ Import Dependencies
// ===============================
const express = require("express");
const cors = require("cors");
const { connectDB, getConnectionStatus } = require("./config/db");

// Models (Dashboard Stats Requires These)
const Product = require("./models/Product");
const Order = require("./models/Order");
const User = require("./models/User");

// ===============================
// 3️⃣ Validate ENV Variables
// ===============================
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI missing in .env file!");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.warn("⚠ WARNING: JWT_SECRET missing! Using fallback (not recommended).");
  process.env.JWT_SECRET = "fallbackSecretKey";
}

// ===============================
// 4️⃣ Connect to MongoDB
// ===============================
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
  }
})();

// ===============================
// 5️⃣ Initialize Express App
// ===============================
const app = express();

// ===============================
// 6️⃣ Middleware (সংশোধিত CORS লজিক)
// ===============================

// ✅ CORS Whitelist তৈরি করা হলো
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5178', 
    'https://coinhousemarket.com',
];

// ✅ CORS কনফিগারেশন: ফ্লেক্সিবল লজিক ব্যবহার করা হলো যাতে সব লোকাল রিকোয়েস্ট গ্রহণ করে
app.use(
  cors({
    origin: (origin, callback) => {
        // যদি রিকোয়েস্টটি লোকালহোস্ট থেকে আসে (যেমন: postman বা সার্ভার-টু-সার্ভার)
        // অথবা হোয়াইট লিস্টে থাকে, তবে অনুমতি দিন
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // অন্য কোনো ডোমেন হলে ব্লক করুন
            console.log(`❌ CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
  })
);

app.use(express.json());

// Debug Logger (only in development)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    if (Object.keys(req.body).length > 0) {
      console.log("📦 Body:", req.body);
    }
    next();
  });
}

// ===============================
// 7️⃣ Safe Route Import Handler
// ===============================
function safeRequire(routePath) {
  try {
    return require(routePath);
  } catch (err) {
    console.warn(`⚠️ Route "${routePath}" not found. Skipping...`);
    return express.Router();
  }
}

// ===============================
// 8️⃣ Import & Use Routes
// ===============================
const productRoutes = safeRequire("./routes/productRoutes");
const orderRoutes = safeRequire("./routes/orderRoutes");
const authRoutes = safeRequire("./routes/authRoutes");
const feedbackRoutes = safeRequire("./routes/feedbackRoutes");

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);

// ===============================
// 9️⃣ Health Check Endpoint
// ===============================
app.get("/api/health", (req, res) => {
  const dbStatus =
    typeof getConnectionStatus === "function"
      ? getConnectionStatus()
      : "unknown";

  res.json({ status: "ok", dbStatus });
});

// ===============================
// 🔟 Dashboard Stats Route
// ===============================
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

    res.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      totalIncome,
      totalUsers,
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 1️⃣1️⃣ Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});