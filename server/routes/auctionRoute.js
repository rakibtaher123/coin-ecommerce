const express = require("express");
const router = express.Router();
const Auction = require("../models/Auction");

// ✅ Helper function: Automatically update auction statuses based on time
const updateAuctionStatuses = async () => {
  try {
    const now = new Date();
    const auctions = await Auction.find();

    for (const auction of auctions) {
      const startTime = new Date(auction.startTime);
      const endTime = new Date(auction.endTime);

      let newStatus = auction.status;

      if (now < startTime) {
        newStatus = 'Upcoming';
      } else if (now >= startTime && now <= endTime) {
        newStatus = 'Live';
      } else if (now > endTime) {
        newStatus = 'Ended';
      }

      // Only update if status changed
      if (newStatus !== auction.status) {
        auction.status = newStatus;
        await auction.save();
        console.log(`✅ Auction "${auction.productName}" status updated: ${auction.status} → ${newStatus}`);
      }
    }
  } catch (err) {
    console.error("❌ Error updating auction statuses:", err);
  }
};

// Create Auction
router.post("/", async (req, res) => {
  try {
    const auction = new Auction(req.body);
    const saved = await auction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get All Auctions (with automatic status update)
router.get("/", async (req, res) => {
  try {
    // ✅ First, update all auction statuses based on current time
    await updateAuctionStatuses();

    // Then fetch and return auctions
    const auctions = await Auction.find().sort({ createdAt: -1 });
    res.json(auctions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update Auction
router.put("/:id", async (req, res) => {
  try {
    const updated = await Auction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Auction not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ⚡ PATCH: Update auction status only (simpler & safer)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Upcoming', 'Live', 'Ended'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Auction.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Auction not found" });

    console.log(`✅ Status changed: "${updated.productName}" → ${status}`);
    res.json(updated);
  } catch (err) {
    console.error("❌ Status update error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Delete Auction
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Auction.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Auction not found" });
    res.json({ message: "Auction deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// 🔍 DEBUG: Check auction statuses and times
router.get("/debug/status", async (req, res) => {
  try {
    const auctions = await Auction.find();
    const now = new Date();

    const debugInfo = auctions.map(auction => ({
      productName: auction.productName,
      currentStatus: auction.status,
      startTime: auction.startTime,
      endTime: auction.endTime,
      currentTime: now.toISOString(),
      shouldBeLive: now >= new Date(auction.startTime) && now <= new Date(auction.endTime),
      isPast: now > new Date(auction.endTime),
      isFuture: now < new Date(auction.startTime)
    }));

    res.json({ currentTime: now.toISOString(), auctions: debugInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
