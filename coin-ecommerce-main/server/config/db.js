const mongoose = require("mongoose");

// MongoDB readyState map
const mapReadyState = (state) => {
  switch (state) {
    case 0:
      return "disconnected";
    case 1:
      return "connected";
    case 2:
      return "connecting";
    case 3:
      return "disconnecting";
    default:
      return "unknown";
  }
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined inside .env file");
    }

    mongoose.set("strictQuery", false);

    // Enable mongoose debug logs (optional)
    if (process.env.MONGOOSE_DEBUG === "true") {
      mongoose.set("debug", true);
      console.log("ℹ️ Mongoose Debug Mode Enabled");
    }

    // Mongoose 9.0+ এ useNewUrlParser এবং useUnifiedTopology অপশন আর লাগে না।
    // তাই সরাসরি কানেকশন দেওয়া হলো।
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host} (${mapReadyState(
        conn.connection.readyState
      )})`
    );

    // event: connected
    mongoose.connection.on("connected", () => {
      console.log("ℹ️ Mongoose Event: connected");
    });

    // event: error
    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose Event: error", err.message);
    });

    // event: disconnected
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Mongoose Event: disconnected");
    });

    // graceful shutdown
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("✋ Mongoose connection closed on app termination");
        process.exit(0);
      } catch (error) {
        console.error("❌ Error during Mongoose shutdown:", error.message);
        process.exit(1);
      }
    });

    return mongoose.connection;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// Get connection status
const getConnectionStatus = () => {
  return mapReadyState(mongoose.connection.readyState);
};

module.exports = {
  connectDB,
  getConnectionStatus,
};