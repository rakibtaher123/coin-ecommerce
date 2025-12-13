// add_bangladesh_products.js
// Run this script to add Bangladeshi Republic Coins and Notes to database

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/coin-ecommerce');

// Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    image: String
});

const Product = mongoose.model('Product', productSchema);

// Bangladeshi Republic Coins
const bangladeshiCoins = [
    {
        name: "1 Poisha Coin (1974)",
        category: "Bangladeshi Republic Coins",
        price: 50,
        image: "/assets/bangladesh_coins/1_poisha_1974.jpg"
    },
    {
        name: "5 Poisha Coin (1974)",
        category: "Bangladeshi Republic Coins",
        price: 80,
        image: "/assets/bangladesh_coins/5_poisha_1974.jpg"
    },
    {
        name: "10 Poisha Coin (1974)",
        category: "Bangladeshi Republic Coins",
        price: 100,
        image: "/assets/bangladesh_coins/10_poisha_1974.jpg"
    },
    {
        name: "25 Poisha Coin (1977)",
        category: "Bangladeshi Republic Coins",
        price: 150,
        image: "/assets/bangladesh_coins/25_poisha_1977.jpg"
    },
    {
        name: "50 Poisha Coin (1977)",
        category: "Bangladeshi Republic Coins",
        price: 200,
        image: "/assets/bangladesh_coins/50_poisha_1977.jpg"
    },
    {
        name: "1 Taka Coin (1975)",
        category: "Bangladeshi Republic Coins",
        price: 300,
        image: "/assets/bangladesh_coins/1_taka_1975.jpg"
    },
    {
        name: "1 Taka World Food Day (1981)",
        category: "Bangladeshi Republic Coins",
        price: 500,
        image: "/assets/bangladesh_coins/1_taka_food_day_1981.jpg"
    },
    {
        name: "2 Taka Coin (1980)",
        category: "Bangladeshi Republic Coins",
        price: 400,
        image: "/assets/bangladesh_coins/2_taka_1980.jpg"
    },
    {
        name: "5 Taka Coin (1994)",
        category: "Bangladeshi Republic Coins",
        price: 600,
        image: "/assets/bangladesh_coins/5_taka_1994.jpg"
    },
    {
        name: "5 Taka FAO Coin (1977)",
        category: "Bangladeshi Republic Coins",
        price: 800,
        image: "/assets/bangladesh_coins/5_taka_fao_1977.jpg"
    },
    {
        name: "10 Taka National Assembly (1985)",
        category: "Bangladeshi Republic Coins",
        price: 1000,
        image: "/assets/bangladesh_coins/10_taka_assembly_1985.jpg"
    },
    {
        name: "10 Taka Independence (1996)",
        category: "Bangladeshi Republic Coins",
        price: 1200,
        image: "/assets/bangladesh_coins/10_taka_independence_1996.jpg"
    },
    {
        name: "Shapla Flower 1 Taka",
        category: "Bangladeshi Republic Coins",
        price: 250,
        image: "/assets/bangladesh_coins/shapla_1_taka.jpg"
    },
    {
        name: "Railway Centenary 5 Taka (1985)",
        category: "Bangladeshi Republic Coins",
        price: 900,
        image: "/assets/bangladesh_coins/railway_5_taka_1985.jpg"
    },
    {
        name: "National Monument 5 Taka",
        category: "Bangladeshi Republic Coins",
        price: 700,
        image: "/assets/bangladesh_coins/monument_5_taka.jpg"
    }
];

// Bangladeshi Republic Notes
const bangladeshiNotes = [
    {
        name: "1 Taka Note (1973)",
        category: "Bangladeshi Republic Notes",
        price: 200,
        image: "/assets/bangladesh_notes/1_taka_1973.jpg"
    },
    {
        name: "5 Taka Note (1977)",
        category: "Bangladeshi Republic Notes",
        price: 300,
        image: "/assets/bangladesh_notes/5_taka_1977.jpg"
    },
    {
        name: "10 Taka Note (1978)",
        category: "Bangladeshi Republic Notes",
        price: 400,
        image: "/assets/bangladesh_notes/10_taka_1978.jpg"
    },
    {
        name: "20 Taka Note (1979)",
        category: "Bangladeshi Republic Notes",
        price: 500,
        image: "/assets/bangladesh_notes/20_taka_1979.jpg"
    },
    {
        name: "50 Taka Note (1976)",
        category: "Bangladeshi Republic Notes",
        price: 600,
        image: "/assets/bangladesh_notes/50_taka_1976.jpg"
    },
    {
        name: "100 Taka Note (1972)",
        category: "Bangladeshi Republic Notes",
        price: 800,
        image: "/assets/bangladesh_notes/100_taka_1972.jpg"
    },
    {
        name: "500 Taka Note (1982)",
        category: "Bangladeshi Republic Notes",
        price: 1500,
        image: "/assets/bangladesh_notes/500_taka_1982.jpg"
    },
    {
        name: "1000 Taka Note (2008)",
        category: "Bangladeshi Republic Notes",
        price: 2000,
        image: "/assets/bangladesh_notes/1000_taka_2008.jpg"
    },
    {
        name: "2 Taka Note (1989)",
        category: "Bangladeshi Republic Notes",
        price: 250,
        image: "/assets/bangladesh_notes/2_taka_1989.jpg"
    },
    {
        name: "5 Taka Polymer Note (2011)",
        category: "Bangladeshi Republic Notes",
        price: 350,
        image: "/assets/bangladesh_notes/5_taka_polymer_2011.jpg"
    },
    {
        name: "10 Taka Victory Day Note",
        category: "Bangladeshi Republic Notes",
        price: 450,
        image: "/assets/bangladesh_notes/10_taka_victory.jpg"
    },
    {
        name: "40 Taka Commemorative (2012)",
        category: "Bangladeshi Republic Notes",
        price: 1200,
        image: "/assets/bangladesh_notes/40_taka_commemorative_2012.jpg"
    },
    {
        name: "Mujib 100 Taka Note",
        category: "Bangladeshi Republic Notes",
        price: 900,
        image: "/assets/bangladesh_notes/mujib_100_taka.jpg"
    },
    {
        name: "60 Taka Diamond Jubilee (2017)",
        category: "Bangladeshi Republic Notes",
        price: 1500,
        image: "/assets/bangladesh_notes/60_taka_jubilee_2017.jpg"
    },
    {
        name: "25 Taka Independence Note",
        category: "Bangladeshi Republic Notes",
        price: 800,
        image: "/assets/bangladesh_notes/25_taka_independence.jpg"
    }
];

// Insert all products
async function insertProducts() {
    try {
        console.log('🚀 Starting to insert Bangladeshi products...');

        // Insert coins
        const coinsResult = await Product.insertMany(bangladeshiCoins);
        console.log(`✅ Inserted ${coinsResult.length} Bangladeshi Republic Coins`);

        // Insert notes
        const notesResult = await Product.insertMany(bangladeshiNotes);
        console.log(`✅ Inserted ${notesResult.length} Bangladeshi Republic Notes`);

        console.log('🎉 All products inserted successfully!');
        console.log(`Total: ${coinsResult.length + notesResult.length} products`);

        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error inserting products:', error);
        mongoose.connection.close();
    }
}

// Run the insertion
insertProducts();
