import React, { useState, useEffect, useContext } from 'react';
import { Container, Grid, Typography, Box, Button, Paper, TextField, CircularProgress } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import TimerIcon from '@mui/icons-material/Timer';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BiddingModal from '../components/BiddingModal';
import axios from 'axios';

// ✅ আপনার সার্ভারের ঠিকানা (ব্যাকএন্ড পোর্ট)
const API_BASE_URL = "http://localhost:5000";

const LiveAuctionPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext);

  // ডিফল্ট অকশন ডাটা (যদি সার্ভার থেকে ডাটা না আসে বা লোড হতে দেরি হয়)
  const [auctionData, setAuctionData] = useState(null); // API ?? load ??

  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true); // শুরুতে API call এর জন্য loading
  const [error, setError] = useState(null); // Error tracking
  const [modalOpen, setModalOpen] = useState(false); // Bidding modal state

  // ✅ ইমেজ ফিক্স করার ফাংশন (ম্যাজিক কোড)
  // এটি চেক করবে ইমেজ পাথ লোকাল নাকি অনলাইন এবং সে অনুযায়ী URL ঠিক করবে
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/logos/coin_hero.jpg"; // একদম ছবি না থাকলে ডিফল্ট
    if (imagePath.startsWith("http")) return imagePath;   // যদি অনলাইন লিংক হয়
    return `${API_BASE_URL}${imagePath}`;               // ✅ সার্ভার লিংক যুক্ত করা হলো (/assets এর আগে)
  };

  // ✅ Backend থেকে Live Auction fetch করা
  useEffect(() => {
    const fetchLiveAuction = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching live auctions from:', `${API_BASE_URL}/api/auctions`);
        const { data } = await axios.get(`${API_BASE_URL}/api/auctions`);
        console.log('📦 All auctions:', data);

        // Live status এর auction খুঁজে বের করা
        const liveAuction = data.find(auction => auction.status === 'Live');
        console.log('🔴 Live auction found:', liveAuction);

        if (liveAuction) {
          // Backend data কে frontend format এ convert করা
          setAuctionData({
            name: liveAuction.productName,
            description: `Category: ${liveAuction.category}. Base Price: ৳${liveAuction.basePrice.toLocaleString()}`,
            image: liveAuction.productImage,
            currentBid: liveAuction.highestBid || liveAuction.basePrice,
            endTime: new Date(liveAuction.endTime).getTime(),
            _id: liveAuction._id,
            category: liveAuction.category,
            productName: liveAuction.productName,
            basePrice: liveAuction.basePrice,
            highestBid: liveAuction.highestBid || liveAuction.basePrice,
            totalBids: liveAuction.totalBids || 0
          });
          setError(null);
        } else {
          setError('No live auction available at the moment.');
          console.log('⚠️ No live auction found');
        }
      } catch (err) {
        console.error('❌ Error fetching live auction:', err);
        setError('Failed to load live auction data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveAuction();

    // ✅ Auto-refresh every 5 seconds for real-time updates
    const refreshInterval = setInterval(() => {
      fetchLiveAuction();
    }, 5000);

    return () => clearInterval(refreshInterval);
  }, []);

  // টাইমার লজিক
  useEffect(() => {
    if (!auctionData) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = auctionData.endTime - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft(0);
      } else {
        setTimeLeft(Math.floor(distance / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionData]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleBid = () => {
    // Check if user is logged in using localStorage directly
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userEmail) {
      alert("Please login to place a bid");
      // ✅ Redirect with return path
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    if (userRole === 'admin') {
      alert("❌ Admins cannot bid.");
      return;
    }

    // Open bidding modal
    setModalOpen(true);
  };

  const handleBidPlaced = async () => {
    // Refresh auction data after bid is placed
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/auctions`);
      const liveAuction = data.find(auction => auction.status === 'Live');

      if (liveAuction) {
        setAuctionData({
          name: liveAuction.productName,
          description: `Category: ${liveAuction.category}. Base Price: ৳${liveAuction.basePrice.toLocaleString()}`,
          image: liveAuction.productImage,
          currentBid: liveAuction.highestBid || liveAuction.basePrice,
          endTime: new Date(liveAuction.endTime).getTime(),
          _id: liveAuction._id,
          category: liveAuction.category,
          productName: liveAuction.productName,
          basePrice: liveAuction.basePrice,
          highestBid: liveAuction.highestBid || liveAuction.basePrice,
          totalBids: liveAuction.totalBids || 0
        });
      }
    } catch (error) {
      console.error('Error refreshing auction:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="error" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          🔴 LIVE AUCTION ROOM
        </Typography>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h5" color="error" gutterBottom>⚠️ {error}</Typography>
          <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
            Refresh Page
          </Button>
        </Box>
      )}

      {/* Main Auction Content */}
      {!loading && !error && auctionData && (

        <Grid container spacing={4}>

          {/* ✅ বাম পাশ: প্রোডাক্টের ছবি (ফিক্স করা হয়েছে) */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2, overflow: 'hidden' }}>
              <img
                // 🔥 এখানে ফাংশনটি কল করা হয়েছে যা ইমেজ পাথ ঠিক করে দেবে
                src={getImageUrl(auctionData.image)}
                alt="Auction Item"
                // যদি সার্ভারেও ছবি না পায়, তবে লোকাল হিরো ইমেজ দেখাবে (ডাবল সেফটি)
                onError={(e) => { e.target.onerror = null; e.target.src = "/assets/logos/coin_hero.jpg"; }}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  transition: 'transform 0.3s ease',
                  cursor: 'zoom-in'
                }}
                // মাউস নিলে জুম হবে (UX ইম্প্রুভমেন্ট)
                onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.target.style.transform = "scale(1.0)"}
              />
            </Paper>
          </Grid>

          {/* ডান পাশ: বিডিং কন্ট্রোল */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {auctionData.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {auctionData.description}
              </Typography>

              {/* Timer */}
              <Box sx={{ my: 3, p: 2, bgcolor: timeLeft > 300 ? '#fff3e0' : '#ffebee', border: '1px solid', borderColor: timeLeft > 300 ? '#ffb74d' : '#ef5350', borderRadius: 2 }}>
                <Typography variant="h6" color={timeLeft > 300 ? "warning.main" : "error.main"} sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                  <TimerIcon />
                  {timeLeft > 0 ? `Ends in: ${formatTime(timeLeft)}` : "AUCTION ENDED"}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h6" color="text.secondary">Current Highest Bid</Typography>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  ৳ {auctionData.currentBid.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Next Minimum Bid"
                  value={auctionData.currentBid + 500}
                  InputProps={{ readOnly: true }}
                />

                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<GavelIcon />}
                  onClick={handleBid}
                  disabled={timeLeft === 0}
                  sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1.1rem' }}
                >
                  {timeLeft > 0 ? `PLACE BID` : "BIDDING CLOSED"}
                </Button>

                <Typography variant="caption" color="text.secondary" align="center">
                  * Click to open bidding modal and place your bid securely.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Bidding Modal */}
      {auctionData && (
        <BiddingModal
          auction={auctionData}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onBidPlaced={handleBidPlaced}
        />
      )}
    </Container>
  );
};

export default LiveAuctionPage;