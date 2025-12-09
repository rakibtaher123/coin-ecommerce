// server/controllers/adminController.js

const Order = require('../models/orderModel');   // তোমার অর্ডার মডেল
const Product = require('../models/productModel'); // তোমার প্রোডাক্ট মডেল
const User = require('../models/userModel');     // তোমার ইউজার মডেল

exports.getAdminStats = async (req, res) => {
    try {
        // ১. টোটাল অর্ডার সংখ্যা
        const totalOrders = await Order.countDocuments();

        // ২. টোটাল প্রোডাক্ট সংখ্যা (স্টকে কতগুলো আইটেম আছে)
        const totalProducts = await Product.countDocuments();

        // ৩. টোটাল রেজিস্টার্ড ইউজার
        const totalUsers = await User.countDocuments({ role: 'user' }); 

        // ৪. টোটাল ইনকাম (সব অর্ডারের টাকা যোগ করা)
        // ডাটাবেসে টাকার ফিল্ডের নাম যদি 'totalAmount' বা 'price' হয়, সেটা এখানে দিবে।
        // আমি ধরে নিলাম ফিল্ডের নাম 'totalAmount'
        const incomeResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: "$totalAmount" } 
                }
            }
        ]);
        
        const totalIncome = incomeResult.length > 0 ? incomeResult[0].totalIncome : 0;

        // ৫. রেসপন্স পাঠানো
        res.status(200).json({
            success: true,
            totalOrders,
            totalProducts,
            totalUsers,
            totalIncome
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard stats"
        });
    }
};