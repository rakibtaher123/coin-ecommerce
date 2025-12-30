const express = require("express");
const router = express.Router();
const auctionController = require("../controllers/auctionController");
const jwt = require('jsonwebtoken');

// Middleware to verify token for bidding
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Routes
router.get("/", auctionController.getAllAuctions);

// ✅ Dynamic Archives & Realization
router.get("/archives", auctionController.getArchives);
router.get("/realization/:id", auctionController.getRealization);

router.get("/:id", auctionController.getAuctionById);
router.post("/", auctionController.createAuction);
router.put("/:id", auctionController.updateAuction);         // ✅ Update
router.delete("/:id", auctionController.deleteAuction);      // ✅ Delete
router.patch("/:id/status", auctionController.updateAuctionStatus); // ✅ Update Status (Live/Ended)

// Bid Route (Protected)
router.post("/bid", verifyToken, auctionController.placeBid);

// ✅ Winner Payment Route (Protected)
router.post("/:id/pay", verifyToken, auctionController.processWinnerPayment);

// Utility route to manually trigger status check (or call via cron)
router.get("/utils/check-status", auctionController.checkAuctionStatus);

module.exports = router;
