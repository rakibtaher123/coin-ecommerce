import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Grid, Card, CardMedia, CardContent, Chip, CircularProgress, Button, Divider 
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import axios from 'axios';

// ব্যাকএন্ড URL
const API_BASE_URL = "http://localhost:5000";

const ArchivesPage = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ ইমেজ ফিক্সার ফাংশন
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/logos/coin_hero.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        // ১. রিয়েল ডাটা আনার চেষ্টা
        const { data } = await axios.get(`${API_BASE_URL}/api/auctions`);
        
        // শুধুমাত্র 'Ended' স্ট্যাটাস ফিল্টার করা
        const endedAuctions = data.filter(item => item.status === 'Ended');

        if (endedAuctions.length > 0) {
          setArchives(endedAuctions);
        } else {
          throw new Error("No ended auctions found");
        }
      } catch (error) {
        console.log("Loading realistic dummy archives data...");
        
        // ২. রিয়েলিস্টিক ডামি ডাটা (আপনার ইমেজের মতো)
        setArchives([
          {
            _id: 101,
            productName: "British India 1 Rupee (1917)",
            image: "/assets/british_indian_notes/bi_note_1_rupee_1917.jpg",
            basePrice: 8000,
            highestBid: 10500,
            winner: "Sadman Sakib",
            endTime: "2025-11-20",
            totalBids: 15
          },
          {
            _id: 102,
            productName: "Ancient Bengal Silver Tanka",
            image: "/assets/ancient_bengal/azam_shah_tanka.jpg",
            basePrice: 12000,
            highestBid: 22000,
            winner: "Rahim Uddin",
            endTime: "2025-10-15",
            totalBids: 28
          },
          {
            _id: 103,
            productName: "75 Rupees Commemorative Note",
            image: "/assets/pakistani_notes/pak_note_75_independence.jpg",
            basePrice: 200,
            highestBid: 500,
            winner: "Karim Khan",
            endTime: "2025-09-05",
            totalBids: 8
          },
          {
            _id: 104,
            productName: "East India Company Gold Mohur",
            image: "/assets/east_india_company/eic_gold_mohur_1835.jpg",
            basePrice: 120000,
            highestBid: 150000,
            winner: "Collector_BD",
            endTime: "2025-08-12",
            totalBids: 45
          },
          {
            _id: 105,
            productName: "Rare Mughal Gold Mohur",
            image: "/assets/mughal_empire/mughal_gold_mohur.jpg",
            basePrice: 50000,
            highestBid: 55000,
            winner: "Antik Mahmud",
            endTime: "2025-07-20",
            totalBids: 32
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchArchives();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5', pb: 10 }}>
      
      {/* --- Hero Header --- */}
      <Box sx={{ 
        bgcolor: '#1a237e', 
        color: 'white', 
        py: 8, 
        textAlign: 'center', 
        mb: 6,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("/assets/logos/coin_hero.jpg")', // রিয়েলিস্টিক হিরো ইমেজ
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
      }}>
        <Container>
          <Typography variant="h3" fontWeight="bold" sx={{ fontFamily: 'serif', mb: 2, letterSpacing: 1 }}>
            🏛️ Auction Hall of Fame
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '700px', mx: 'auto', fontWeight: 300 }}>
            Explore our exclusive collection of sold artifacts. Discover historical prices and rare items won by collectors worldwide.
          </Typography>
        </Container>
      </Box>

      {/* --- Archives Grid --- */}
      <Container maxWidth="xl">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress size={60} color="primary" />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {archives.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                <Card sx={{ 
                  borderRadius: 4, 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
                  transition: 'all 0.3s ease', 
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }
                }}>
                  
                  {/* SOLD Badge */}
                  <Chip 
                    label="SOLD" 
                    sx={{ 
                      position: 'absolute', 
                      top: 15, 
                      right: 15, 
                      bgcolor: '#d32f2f', 
                      color: 'white', 
                      fontWeight: 'bold',
                      zIndex: 1,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                    }} 
                  />

                  {/* Product Image */}
                  <Box sx={{ height: '240px', overflow: 'hidden', bgcolor: '#f5f5f5' }}>
                    <CardMedia
                      component="img"
                      height="100%"
                      image={getImageUrl(item.image)}
                      alt={item.productName}
                      onError={(e) => e.target.src = "/assets/logos/coin_hero.jpg"}
                      sx={{ objectFit: 'contain', width: '100%', height: '100%', p: 2, transition: 'transform 0.5s' }}
                      onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
                      onMouseOut={(e) => e.target.style.transform = "scale(1.0)"}
                    />
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
                      height: '56px', overflow: 'hidden', fontSize: '1.1rem', lineHeight: 1.3, color: '#333' 
                    }}>
                      {item.productName}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, color: '#1b5e20', bgcolor: '#e8f5e9', p: 1, borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MonetizationOnIcon fontSize="small" />
                        <Typography variant="body2" fontWeight="bold">Sold Price:</Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">৳ {item.highestBid.toLocaleString()}</Typography>
                    </Box>

                    {item.winner && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <EmojiEventsIcon fontSize="small" color="warning" />
                        <Typography variant="caption" fontWeight="bold" color="text.primary">
                          Winner: <span style={{ color: '#1565c0' }}>{item.winner}</span>
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <EventIcon fontSize="small" />
                      <Typography variant="caption">
                        Ended: {item.endTime ? item.endTime.split('T')[0] : 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      color="primary"
                      sx={{ mt: 2, borderRadius: 5, textTransform: 'none', fontWeight: 'bold' }}
                    >
                      View Auction History
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ArchivesPage;