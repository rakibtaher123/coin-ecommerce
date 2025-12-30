const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// কনফিগারেশন লোড করা
dotenv.config();

// ডাটাবেস কানেকশন
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

// ডাটা ফাইল ইম্পোর্ট
const coinData = require('./coinData'); 

const importData = async () => {
    try {
        await connectDB();

        // ----------------------------------------------------
        // ১. ইউজার হ্যান্ডেলিং (MISSING FIELDS FIXED HERE)
        // ----------------------------------------------------
        
        // চেক করি এডমিন আছে কিনা
        let adminUser = await User.findOne({ email: 'admin@gmail.com' });

        if (!adminUser) {
            console.log('⚠️ Admin not found. Creating new Admin...'.yellow);
            const createdUsers = await User.create([
                {
                    name: 'Admin User',
                    email: 'admin@gmail.com',
                    password: '1234', 
                    role: 'admin',
                    // 👇 এই ফিল্ডগুলো মিসিং ছিল, এখন যোগ করে দিলাম
                    phone: '01700000000',
                    address: 'Admin House, Road 1',
                    city: 'Dhaka',
                    postalCode: '1200'
                },
                {
                    name: 'Client User',
                    email: 'client@gmail.com',
                    password: '1234',
                    role: 'client',
                    // 👇 ক্লায়েন্টের জন্যও যোগ করে দিলাম
                    phone: '01800000000',
                    address: 'Client House, Road 2',
                    city: 'Chittagong',
                    postalCode: '4000'
                }
            ]);
            adminUser = createdUsers[0];
            console.log('✅ Admin & Client Users Created Successfully!'.blue.inverse);
        } else {
            console.log('ℹ️  Existing Admin Found. Using that account.'.blue);
        }

        const adminId = adminUser._id;

        // ----------------------------------------------------
        // ২. প্রোডাক্ট হ্যান্ডেলিং (স্মার্ট চেক)
        // ----------------------------------------------------
        
        console.log('🔄 Checking for new products...'.yellow);
        
        let newProductsCount = 0;
        let productsToInsert = [];

        // coinData লুপ করা
        for (const [categoryKey, items] of Object.entries(coinData)) {
            
            // ক্যাটাগরি নাম ফরম্যাট করা
            const formattedCategory = categoryKey
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            for (const item of items) {
                // চেক: এই নামের প্রোডাক্ট ডাটাবেসে আছে কিনা?
                const existingProduct = await Product.findOne({ name: item.name });

                if (!existingProduct) {
                    let imagePath = item.image;
                    if (!item.image.startsWith('/assets')) {
                        imagePath = `/assets/${categoryKey}/${item.image}`;
                    }

                    productsToInsert.push({
                        user: adminId,
                        name: item.name,
                        image: imagePath,
                        description: item.details || item.description || `Authentic ${item.name} from ${formattedCategory}.`,
                        category: formattedCategory,
                        price: Number(item.price),
                        countInStock: 10,
                        rating: 0,
                        numReviews: 0,
                    });
                    newProductsCount++;
                }
            }
        }

        // ----------------------------------------------------
        // ৩. ফাইনাল ইনসার্ট
        // ----------------------------------------------------
        
        if (productsToInsert.length > 0) {
            await Product.insertMany(productsToInsert);
            console.log(`✅ Success! ${newProductsCount} NEW Products Imported!`.green.inverse);
        } else {
            console.log(`✅ No new products to import. All items already exist!`.green);
        }

        process.exit();

    } catch (error) {
        // বিস্তারিত এরর দেখার জন্য
        console.error(`❌ Error in Import: ${error.message}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();
        await Product.deleteMany();
        await User.deleteMany();
        console.log('🔥 ALL Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}