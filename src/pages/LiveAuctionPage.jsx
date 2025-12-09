import React, { useState, useEffect, useContext } from 'react';
import { Container, Grid, Typography, Box, Button, Paper, TextField, CircularProgress } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import TimerIcon from '@mui/icons-material/Timer';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

// ✅ আপনার সার্ভারের ঠিকানা (ব্যাকএন্ড পোর্ট)
const API_BASE_URL = "http://localhost:5000";

const LiveAuctionPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext);

  // ডিফল্ট অকশন ডাটা (যদি সার্ভার থেকে ডাটা না আসে বা লোড হতে দেরি হয়)
  const [auctionData, setAuctionData] = useState({
    name: "Rare Mughal Gold Mohur (1605 AD)",
    description: "Extremely rare gold coin from the era of Emperor Akbar. Perfect condition with mint luster. Historical piece from the Agra Mint.",
    // ✅ এখানে খেয়াল করুন: পাথটি ডাটাবেস স্টাইলে দেওয়া
    image: "/assets/mughal_empire/mughal_gold_mohur.jpg", 
    currentBid: 15500,
    endTime: new Date().getTime() + 3600 * 1000 // ১ ঘণ্টা পর
  });

  const [timeLeft, setTimeLeft] = useState(0); 
  const [loading, setLoading] = useState(false); // লোডিং স্টেট (ফিউচার ইউজ)

  // ✅ ইমেজ ফিক্স করার ফাংশন (ম্যাজিক কোড)
  // এটি চেক করবে ইমেজ পাথ লোকাল নাকি অনলাইন এবং সে অনুযায়ী URL ঠিক করবে
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/logos/coin_hero.jpg"; // একদম ছবি না থাকলে ডিফল্ট
    if (imagePath.startsWith("http")) return imagePath;   // যদি অনলাইন লিংক হয়
    return `${API_BASE_URL}${imagePath}`;               // ✅ সার্ভার লিংক যুক্ত করা হলো (/assets এর আগে)
  };

  // টাইমার লজিক
  useEffect(() => {
    // এখানে আপনি চাইলে ভবিষ্যতে API কল করে লাইভ অকশন ডাটা আনতে পারেন
    // const fetchLiveAuction = async () => { ... }

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
    if (!isLoggedIn) {
      alert("⚠️ You must log in to place a bid!");
      navigate('/login');
      return;
    }
    if (user?.role === 'admin') {
      alert("❌ Admins cannot bid.");
      return;
    }
    
    // পেমেন্ট পেজে রিডাইরেক্ট
    const nextBidAmount = auctionData.currentBid + 500;
    navigate('/payment', { 
      state: { 
        amount: nextBidAmount, 
        productName: auctionData.name,
        type: "Auction Bid"
      } 
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="error" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          🔴 LIVE AUCTION ROOM
        </Typography>
      </Box>

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
                {timeLeft > 0 ? `PAY & PLACE BID (৳ ${(auctionData.currentBid + 500).toLocaleString()})` : "BIDDING CLOSED"}
              </Button>
              
              <Typography variant="caption" color="text.secondary" align="center">
                * Clicking this will redirect you to the secure payment gateway.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LiveAuctionPage;