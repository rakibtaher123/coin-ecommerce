const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// কনফিগারেশন লোড
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const resetData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for Reset...");

    // Orders কালেকশন ডিলিট করা
    await mongoose.connection.collection('orders').deleteMany({});
    
    console.log("🔥🔥🔥 ALL FAKE ORDERS DELETED SUCCESSFULLY! 🔥🔥🔥");
    process.exit();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

resetData();