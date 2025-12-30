import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Container, Grid, Typography, Button, TextField, Card, CardMedia, Chip, Paper, Stack } from "@mui/material";
import io from "socket.io-client";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Assuming you have an AuthContext

// Connect to Backend Socket
const socket = io.connect("http://localhost:5000");

const LiveAuctionPage = () => {
  const { id } = useParams(); // Auction ID from URL
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get logged-in user

  // State
  const [currentBid, setCurrentBid] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // Default 5 mins, will update from DB
  const [auction, setAuction] = useState(null); // Auction Data
  const [myBid, setMyBid] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Load Initial Data & Join Socket Room
  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auctions/${id}`);
        const data = res.data;

        setAuction(data);
        setCurrentBid(data.currentPrice || data.startingPrice);

        // Calculate Time Left
        const endTime = new Date(data.endTime).getTime();
        const now = new Date().getTime();
        const diffSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(diffSeconds);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load auction:", err);
        setLoading(false);
      }
    };

    fetchAuction();

    // Join Socket Room
    socket.emit("join_auction", id);
    console.log(`Joined room: ${id}`);

    // Listen for Real-Time Bid Updates
    socket.on("receive_bid", (data) => {
      console.log("Bid Update Received:", data);
      setCurrentBid(data.highestBid);
      // Optional: Update history if backend sends it, or just append locally
      if (data.bidHistory) {
        setBidHistory(data.bidHistory);
      } else {
        setBidHistory((prev) => [{ user: data.lastBidder, amount: data.highestBid, time: new Date() }, ...prev]);
      }
    });

    socket.on("bid_error", (err) => {
      alert(err.message);
    });

    return () => {
      socket.off("receive_bid");
      socket.off("bid_error");
    };
  }, [id]);

  // 2. Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAuctionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAuctionEnd = () => {
    // Ideally, backend handles the closing via cron or check-status logic
    alert("🛑 Auction Ended! Redirecting to outcomes...");
    // navigate("/archives"); // Or stay to see results
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${secs}s`;
  };

  // 3. Place Bid Handler
  const placeBid = () => {
    if (!user) {
      alert("Please login to bid!");
      navigate("/login");
      return;
    }

    const bidAmount = Number(myBid);

    // Validation
    if (!bidAmount || bidAmount <= currentBid) {
      alert(`Bid must be higher than current price (৳${currentBid})`);
      return;
    }

    // Min Increment Check (Optional)
    const increment = auction.incrementAmount || 100;
    if (bidAmount < currentBid + increment) {
      alert(`Minimum increment is ৳${increment}. Next valid bid: ৳${currentBid + increment}`);
      return;
    }

    // Emit to Backend
    const bidData = {
      auctionId: id,
      userId: user._id || user.id, // Handle distinct user object structures
      userName: user.name,
      bidAmount: bidAmount,
    };

    socket.emit("place_bid", bidData);
    setMyBid(""); // Clear input
  };

  if (loading) return <Container sx={{ py: 5 }}><Typography>Loading Live Auction...</Typography></Container>;
  if (!auction) return <Container sx={{ py: 5 }}><Typography>Auction not found.</Typography></Container>;

  return (
    <Container sx={{ py: 5 }}>
      <Grid container spacing={4}>

        {/* Left: Product Image & Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <Chip
              label={timeLeft > 0 ? "LIVE" : "ENDED"}
              color={timeLeft > 0 ? "error" : "default"}
              sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1, fontWeight: 'bold' }}
            />
            <Chip
              label={`Lot #${auction.lotNumber || '001'}`}
              color="primary"
              sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1, fontWeight: 'bold' }}
            />

            <Card sx={{ boxShadow: 4, borderRadius: 2, overflow: "hidden" }}>
              <Box sx={{ bgcolor: "#3e0e0e", p: 4, display: 'flex', justifyContent: 'center' }}>
                <CardMedia
                  component="img"
                  image={auction.productImage ? `http://localhost:5000${auction.productImage}` : "https://via.placeholder.com/500x400"}
                  alt={auction.productName}
                  sx={{
                    height: 400,
                    objectFit: "contain",
                    border: '4px solid #b7950b',
                    borderRadius: '50%',
                    width: '400px',
                    bgcolor: 'white'
                  }}
                />
              </Box>
            </Card>
          </Box>
          <Typography variant="h4" sx={{ mt: 3, fontWeight: "bold", color: "#333" }}>
            {auction.productName}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Category: {auction.category}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {auction.description || "A rare collectible item open for live bidding. Don't miss this opportunity."}
          </Typography>
        </Grid>

        {/* Right: Bidding Panel */}
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3, bgcolor: "#fff8f8", border: '1px solid #e0e0e0' }}>

            {/* Timer */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="overline" color={timeLeft < 60 ? "error" : "text.secondary"} sx={{ fontWeight: "bold", fontSize: '1rem' }}>
                {timeLeft > 0 ? "CLOSING IN" : "AUCTION CLOSED"}
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: "bold", color: timeLeft < 60 ? "#d32f2f" : "#333", fontFamily: 'monospace' }}>
                {timeLeft > 0 ? formatTime(timeLeft) : "00:00"}
              </Typography>
            </Box>

            {/* Current Price */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, borderBottom: "1px solid #ddd", pb: 2 }}>
              <Typography variant="h6" color="text.secondary">Current Bid</Typography>
              <Typography variant="h3" color="primary" sx={{ fontWeight: "bold" }}>
                ৳ {currentBid.toLocaleString()}
              </Typography>
            </Box>

            {/* Bid Controls */}
            {timeLeft > 0 && (
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label={`Enter amount >= ৳${currentBid + (auction.incrementAmount || 100)}`}
                      type="number"
                      variant="outlined"
                      value={myBid}
                      onChange={(e) => setMyBid(e.target.value)}
                      InputProps={{ sx: { fontSize: '1.2rem', fontWeight: 'bold' } }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      size="large"
                      sx={{ height: '100%', fontWeight: "bold", fontSize: '1.1rem' }}
                      onClick={placeBid}
                    >
                      BID
                    </Button>
                  </Grid>
                </Grid>
                <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'center' }}>
                  {[100, 500, 1000, 5000].map(amt => (
                    <Chip
                      key={amt}
                      label={`+৳${amt}`}
                      onClick={() => setMyBid(Number(currentBid + amt))}
                      clickable
                      color="default"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Bid History */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold", color: '#555' }}>
                LIVE ACTIVITY
              </Typography>
              <Box sx={{
                height: 250,
                overflowY: "auto",
                bgcolor: "#fff",
                border: '1px solid #eee',
                borderRadius: 2
              }}>
                {bidHistory.length === 0 ? (
                  <Typography sx={{ p: 2, textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>No bids yet. Be the first!</Typography>
                ) : (
                  bidHistory.map((history, index) => (
                    <Box key={index} sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 1.5,
                      borderBottom: "1px solid #f0f0f0",
                      bgcolor: index === 0 ? '#fffbec' : 'transparent' // Highlight latest
                    }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: index === 0 ? 'green' : '#ccc' }} />
                        <Typography variant="body2" fontWeight="bold">{history.user}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={2}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          {history.time ? new Date(history.time).toLocaleTimeString() : 'Just now'}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">৳ {history.amount.toLocaleString()}</Typography>
                      </Stack>
                    </Box>
                  ))
                )}
              </Box>
            </Box>

          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LiveAuctionPage;