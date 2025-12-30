const dotenv = require("dotenv");
const path = require("path");
const { connectDB } = require("./config/db");
const Product = require("./models/Product");

// Load .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Sample products data
const sampleProducts = [
  {
    name: "Janapada Silver Coin",
    image: "/assets/sample-janapada.jpg",
    description: "A historical silver coin from the great Janapada period.",
    price: 2500,
    countInStock: 10,
    category: "JANAPADA SERIES COLLECTION",
    year: "c. 600-300 BCE",
  },
  {
    name: "Mughal Era Gold Mohur",
    image: "/assets/sample-mughal.jpg",
    description: "An exquisite gold mohur from the Mughal empire.",
    price: 75000,
    countInStock: 5,
    category: "MUGHAL SERIES COLLECTION",
    year: "c. 1526-1857 CE",
  },
  {
    name: "Chola Dynasty Copper Coin",
    image: "/assets/sample-chola.jpg",
    description: "A well-preserved copper coin from the Chola dynasty.",
    price: 1200,
    countInStock: 15,
    category: "ANCIENT SERIES COLLECTION",
    year: "c. 300s BCE-1279 CE",
  },
];

// Function to import data into the database
const importData = async () => {
  try {
    // Clear existing products to avoid duplicates
    await Product.deleteMany();
    
    // Insert the sample products
    await Product.insertMany(sampleProducts);

    console.log("✅ Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error with data import:", error);
    process.exit(1);
  }
};

// Function to destroy data from the database
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("✅ Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error with data destruction:", error);
    process.exit(1);
  }
};

// Connect to DB and run functions based on command line arguments
const runSeeder = async () => {
  try {
    await connectDB();
    if (process.argv[2] === "-d") {
      await destroyData();
    } else {
      await importData();
    }
  } catch (err) {
    console.error("❌ MongoDB Connection Failed for Seeder:", err.message);
    process.exit(1);
  }
};

runSeeder();
