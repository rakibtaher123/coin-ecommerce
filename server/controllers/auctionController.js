const Auction = require('../models/Auction');
const Product = require('../models/Product');

// ✅ Place a new bid
exports.placeBid = async (req, res) => {
    try {
        const { auctionId, bidAmount } = req.body;
        const userId = req.user.id; // From authMiddleware

        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ error: "Auction not found" });
        }

        // 1. Check if auction is active
        if (auction.status !== 'active') {
            return res.status(400).json({ error: "Auction is not active" });
        }

        // 2. Check if time has expired
        if (new Date() > new Date(auction.endTime)) {
            auction.status = 'closed';
            auction.winner = auction.highestBidder;
            await auction.save();
            return res.status(400).json({ error: "Auction has ended" });
        }

        // 3. Validation: Bid must be higher than current price
        // Note: If no bids yet, first bid must be >= startingPrice (handled by default currentPrice)
        // But usually bid should be > currentPrice. 
        // Logic: if no bids, msg > startingPrice. if bids, msg > currentPrice.
        // Simplified: must be > currentPrice
        if (bidAmount <= auction.currentPrice) {
            return res.status(400).json({
                error: `Bid must be higher than current price (৳${auction.currentPrice})`
            });
        }

        // 4. Update Auction
        auction.currentPrice = bidAmount;
        auction.highestBidder = userId;
        auction.bids.push({
            user: userId,
            amount: bidAmount,
            time: new Date()
        });

        await auction.save();

        // Populate details for response
        const updatedAuction = await Auction.findById(auctionId)
            .populate('highestBidder', 'name email')
            .populate('bids.user', 'name');

        res.status(200).json({
            message: "✅ Bid placed successfully!",
            auction: updatedAuction
        });

    } catch (err) {
        console.error("Bid Error:", err);
        res.status(500).json({ error: "Failed to place bid" });
    }
};

// ✅ Check and update auction status (Utility/Cron)
exports.checkAuctionStatus = async (req, res) => {
    try {
        const now = new Date();

        // Find active auctions that have passed their end time
        const expiredAuctions = await Auction.find({
            status: 'active',
            endTime: { $lt: now }
        });

        let updatedCount = 0;
        for (const auction of expiredAuctions) {
            auction.status = 'closed';
            auction.winner = auction.highestBidder; // The highest bidder wins
            await auction.save();
            updatedCount++;
            console.log(`🏁 Auction Closed: ${auction.productName}, Winner: ${auction.highestBidder}`);
        }

        if (res) {
            res.status(200).json({
                message: `Checked auctions. Closed ${updatedCount} expired auctions.`,
                closedCount: updatedCount
            });
        }

    } catch (err) {
        console.error("Check Status Error:", err);
        if (res) res.status(500).json({ error: "Failed to check statuses" });
    }
};

// ✅ Create Auction (Admin) - Updated to use new schema
exports.createAuction = async (req, res) => {
    try {
        const { productId, startTime, endTime, startingPrice } = req.body;

        // Fetch product details to populate snapshot fields
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });

        const newAuction = new Auction({
            productId: product._id,
            productName: product.name,
            productImage: product.image,
            category: product.category,
            startTime,
            endTime,
            startingPrice: Number(startingPrice)
        });

        await newAuction.save();
        res.status(201).json({ message: "Auction created successfully", auction: newAuction });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get All Auctions (Active properties)
exports.getAllAuctions = async (req, res) => {
    try {
        // Optional: Trigger status check before fetching
        // await exports.checkAuctionStatus(); 

        const auctions = await Auction.find().sort({ createdAt: -1 });
        res.status(200).json(auctions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get Specific Auction
exports.getAuctionById = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id)
            .populate('highestBidder', 'name')
            .populate('bids.user', 'name'); // Show bidder names

        if (!auction) return res.status(404).json({ error: "Auction not found" });
        res.json(auction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
