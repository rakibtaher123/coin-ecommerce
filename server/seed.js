const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const path = require('path');

// কনফিগারেশন লোড করা (.env ফাইলটি server ফোল্ডারের রুটে আছে)
dotenv.config(); 

// ডাটাবেস কানেকশন ফাংশন
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold);
        process.exit(1);
    }
};

// মডেল ইমপোর্ট
const Product = require('./models/Product');
const User = require('./models/User');

// ⚠️ ডাটা ফাইল ইম্পোর্ট (পাথ ঠিক করা হয়েছে)
// আমরা ধরে নিচ্ছি আপনার data.js ফাইলটি server ফোল্ডারের ভেতরেই আছে (আপনার স্ক্রিনশট অনুযায়ী)
// যদি না থাকে, তবে সঠিক পাথ দিন। যেমন: require('../src/data');
const coinData = require('./coinData'); // বা require('./data.js');

// 🚀 ডাটা ইম্পোর্ট ফাংশন
const importData = async () => {
    try {
        await connectDB(); // ডাটাবেসে কানেক্ট করা

        // ১. আগের সব ডাটা মুছে ফেলা (Clean Start)
        await User.deleteMany();
        await Product.deleteMany();
        console.log('🗑️  Old Data Destroyed...'.red.inverse);

        // ২. অ্যাডমিন ইউজার তৈরি করা
        const createdUsers = await User.create([
            {
                name: 'Admin User',
                email: 'admin@gmail.com',
                password: '1234', // আপনার লগইন ক্রিডেনশিয়াল অনুযায়ী
                role: 'admin',
            },
            {
                name: 'Client User',
                email: 'client@gmail.com',
                password: '1234',
                role: 'client',
            }
        ]);
        
        const adminUser = createdUsers[0]._id; // প্রোডাক্টের সাথে অ্যাডমিন আইডি লিংক করার জন্য
        console.log(`👤 Admin & Client Users Created!`.blue.inverse);

        // ৩. প্রোডাক্ট প্রসেস করা
        let allProducts = [];

        // coinData অবজেক্ট লুপ করা
        for (const [categoryKey, items] of Object.entries(coinData)) {
            
            // ক্যাটাগরি নাম সুন্দর করা (যেমন: medieval_bengal -> Medieval Bengal)
            const formattedCategory = categoryKey
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            const categoryItems = items.map(item => {
                // ইমেজের পাথ ঠিক করা (যদি ডাটা ফাইলে পাথ না থাকে)
                let imagePath = item.image;
                if (!item.image.startsWith('/assets')) {
                    imagePath = `/assets/${categoryKey}/${item.image}`;
                }

                return {
                    user: adminUser, // অ্যাডমিন এই প্রোডাক্ট তৈরি করেছে
                    name: item.name,
                    image: imagePath,
                    description: item.details || item.description || `Authentic ${item.name} from ${formattedCategory} period.`,
                    category: formattedCategory,
                    price: Number(item.price), // দাম নিশ্চিত করা
                    countInStock: 10, // ডিফল্ট স্টক
                    rating: 0,
                    numReviews: 0,
                };
            });

            allProducts = [...allProducts, ...categoryItems];
        }

        // ৪. ডাটাবেসে ইনসার্ট করা
        await Product.insertMany(allProducts);
        console.log(`✅ Success! ${allProducts.length} Products Imported!`.green.inverse);
        
        process.exit();

    } catch (error) {
        console.error(`❌ Error in Import: ${error.message}`.red.inverse);
        process.exit(1);
    }
};

// ❌ ডাটা ডিলিট ফাংশন (যদি শুধু মুছতে চান)
const destroyData = async () => {
    try {
        await connectDB();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('🔥 Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`❌ Error in Destroy: ${error.message}`.red.inverse);
        process.exit(1);
    }
};

// কমান্ড লাইন আর্গুমেন্ট চেক করা (node seed.js -d দিলে ডিলিট হবে)
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}