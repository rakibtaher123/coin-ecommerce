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
            auction.finalPrice = auction.currentPrice; // Set final sold price
            auction.soldDate = now; // Set when auction closed
            await auction.save();
            updatedCount++;
            console.log(`🏁 Auction Closed: ${auction.productName}, Winner: ${auction.highestBidder}, Final Price: ৳${auction.currentPrice}`);
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

// ✅ Create Auction (Admin)
exports.createAuction = async (req, res) => {
    try {
        const {
            productId, startTime, endTime, startingPrice, basePrice,
            lotNumber, minEstimate, maxEstimate, incrementAmount
        } = req.body;

        // Frontend sends 'basePrice', Model expects 'startingPrice'
        const price = startingPrice || basePrice;

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
            startingPrice: Number(price),
            basePrice: Number(basePrice || price),
            lotNumber,
            minEstimate,
            maxEstimate,
            incrementAmount
        });

        await newAuction.save();
        res.status(201).json({ message: "✅ Auction created successfully", auction: newAuction });

    } catch (err) {
        console.error("Create Auction Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// ✅ Update Auction (Admin)
// ✅ Update Auction (Admin)
exports.updateAuction = async (req, res) => {
    try {
        const {
            startTime, endTime, startingPrice, basePrice, status,
            lotNumber, minEstimate, maxEstimate, incrementAmount,
            productId, productName, productImage, category // Add these
        } = req.body;

        const price = startingPrice || basePrice;

        const updateData = {};
        if (startTime) updateData.startTime = startTime;
        if (endTime) updateData.endTime = endTime;
        if (price !== undefined) {
            updateData.startingPrice = Number(price);
            updateData.basePrice = Number(basePrice || price);
        }
        if (status) updateData.status = status;

        // New Fields
        if (lotNumber) updateData.lotNumber = lotNumber;
        if (minEstimate !== undefined) updateData.minEstimate = Number(minEstimate);
        if (maxEstimate !== undefined) updateData.maxEstimate = Number(maxEstimate);
        if (incrementAmount !== undefined) updateData.incrementAmount = Number(incrementAmount);

        // Product Details (Allow changing product)
        if (productId) updateData.productId = productId;
        if (productName) updateData.productName = productName;
        if (productImage) updateData.productImage = productImage;
        if (category) updateData.category = category;

        const updatedAuction = await Auction.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedAuction) return res.status(404).json({ error: "Auction not found" });

        res.status(200).json({ message: "✅ Auction updated successfully", auction: updatedAuction });
    } catch (err) {
        console.error("Update Auction Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// ✅ Delete Auction (Admin)
// ✅ Delete Auction (Admin)
// ✅ Delete Auction (Admin)
exports.deleteAuction = async (req, res) => {
    try {
        const deletedAuction = await Auction.findByIdAndDelete(req.params.id);

        if (!deletedAuction) {
            return res.status(404).json({ error: "Auction not found" });
        }

        res.status(200).json({ message: "✅ Auction deleted successfully" });
    } catch (err) {
        console.error("Delete Auction Error:", err);
        res.status(500).json({ error: "Failed to delete auction" });
    }
};

// ✅ Update Auction Status (LIVE/ENDED)
exports.updateAuctionStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'Live', 'Ended', 'active', 'closed'

        // Map frontend status to backend enum if needed
        let dbStatus = 'active';
        if (status === 'Ended' || status === 'closed') dbStatus = 'closed';
        if (status === 'Live' || status === 'active') dbStatus = 'active';

        // NOTE: If status is 'Live', we might want to also ensure startTime is past/now
        const updateData = { status: dbStatus };

        // If setting to Live, force startTime to now if it's in future? 
        // For now, just trust the status update.

        const updatedAuction = await Auction.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedAuction) return res.status(404).json({ error: "Auction not found" });

        res.status(200).json({ message: `Auction marked as ${status}`, auction: updatedAuction });
    } catch (err) {
        console.error("Status Update Error:", err);
        res.status(500).json({ error: "Failed to update status" });
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

// ==========================================
// 🏛️ ARCHIVES & REALIZATION LOGIC
// ==========================================

// ✅ Get Archives (Grouped by Month/Event)
exports.getArchives = async (req, res) => {
    try {
        // 1. Fetch all CLOSED auctions
        const closedAuctions = await Auction.find({ status: 'closed' }).sort({ endTime: -1 });

        // 2. Group by "Month Year" (e.g. "December 2024")
        // In a real scenario, you might have an "AuctionEvent" model. 
        // Here we simulate it by grouping auctions that ended in the same month.
        const groups = {};
        const cities = ["Dhaka", "Chittagong", "Rajshahi", "Comilla", "Sylhet", "Khulna"];

        closedAuctions.forEach(auction => {
            const date = new Date(auction.endTime);
            const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });

            if (!groups[key]) {
                // Deterministic City Selection based on month length
                const cityIndex = key.length % cities.length;

                groups[key] = {
                    _id: key, // Using the date string as the ID for now
                    name: `AUCTION - ${cities[cityIndex]}`,
                    dateString: key,
                    displayDate: date.toLocaleDateString(),
                    image: auction.productImage, // Use first image as cover
                    pdfLink: "/files/auction-1.pdf", // Placeholder
                    totalLots: 0
                };
            }
            groups[key].totalLots++;
        });

        // Convert to array
        const results = Object.values(groups);

        res.status(200).json(results);
    } catch (err) {
        console.error("Archives Error:", err);
        res.status(500).json({ error: "Failed to fetch archives" });
    }
};

// ✅ Get Realization Data (Items for a specific Archive Group)
exports.getRealization = async (req, res) => {
    try {
        const { id } = req.params; // This is the "Month Year" string key e.g. "December 2024"

        // 1. Find all closed auctions that match this Month-Year
        // We have to filter purely in JS or rigorous date query. JS is easier here for small scale.
        const allClosed = await Auction.find({ status: 'closed' })
            .populate('productId', 'name image') // Get product details
            .populate('highestBidder', 'name email'); // Get winner details

        const products = allClosed.filter(auc => {
            const d = new Date(auc.endTime);
            const key = d.toLocaleString('default', { month: 'long', year: 'numeric' });
            return key === id;
        });

        // 2. Format for Frontend
        // We need: Lot Number, Name, Highest Bid (or 0/null), Winner Info
        const auctionDetails = {
            name: `Result for ${id}`,
            date: id
        };

        const formattedProducts = products.map((item, index) => ({
            _id: item._id,
            lotNumber: item.lotNumber || `Lot ${index + 1}`,
            name: item.productName || "Unknown Item",
            image: item.productImage,
            highestBid: item.currentPrice, // The winning price
            winnerId: item.highestBidder ? item.highestBidder._id : null,
            isSold: !!item.highestBidder // If there is a highest bidder, it's sold
        }));

        // Sort by Lot number (numeric safe sort)
        formattedProducts.sort((a, b) => {
            const numA = parseInt(a.lotNumber.replace(/\D/g, '')) || 0;
            const numB = parseInt(b.lotNumber.replace(/\D/g, '')) || 0;
            return numA - numB;
        });

        res.status(200).json({
            auctionDetails,
            products: formattedProducts
        });

    } catch (err) {
        console.error("Realization Error:", err);
        res.status(500).json({ error: "Failed to fetch realization data" });
    }
};

// ✅ Winner Payment - Move auction to archives after payment
exports.processWinnerPayment = async (req, res) => {
    try {
        const { id } = req.params; // Auction ID
        const userId = req.user?.id; // From auth middleware

        const auction = await Auction.findById(id);

        if (!auction) {
            return res.status(404).json({ error: "Auction not found" });
        }

        // Verify auction is closed
        if (auction.status !== 'closed') {
            return res.status(400).json({ error: "Auction is not closed yet" });
        }

        // Verify user is the winner
        if (auction.winner?.toString() !== userId) {
            return res.status(403).json({ error: "Only the winner can pay for this auction" });
        }

        // Process payment (integrate with actual payment gateway here)
        // For now, we'll just mark as sold

        auction.status = 'sold'; // Move to archives
        auction.soldDate = new Date();
        await auction.save();

        res.status(200).json({
            success: true,
            message: "Payment successful! Item moved to archives.",
            auction
        });

    } catch (err) {
        console.error("Payment Error:", err);
        res.status(500).json({ error: "Payment processing failed" });
    }
};
