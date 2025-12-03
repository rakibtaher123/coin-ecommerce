import React from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; // আমাদের ঠিক করা কার্ড কম্পোনেন্ট
import coinData from '../dataWithMeta'; // enriched data import

const HomePage = () => {
  const navigate = useNavigate();

  // --- লজিক: ডাটা ফাইল থেকে অটোমেটিক কিছু ফিচারড প্রোডাক্ট তৈরি করা ---
  const getFeaturedProducts = () => {
    const featured = [];
    const categories = Object.keys(coinData); // সব ক্যাটাগরির নাম নেওয়া হলো (যেমন: ancient_bengal)

    // প্রথম ৬টি ক্যাটাগরি থেকে ১টি করে প্রোডাক্ট নিয়ে ফিচারড লিস্ট বানানো হচ্ছে
    categories.slice(0, 6).forEach((categoryKey) => {
      const items = coinData[categoryKey];
      
      // যদি ওই ক্যাটাগরিতে কোনো প্রোডাক্ট থাকে
      if (items && items.length > 0) {
        const firstItem = items[0]; 
        
        // আমরা পুরো প্রোডাক্ট অবজেক্টটি নেব এবং সাথে ক্যাটাগরি নামটা যোগ করে দেব
        // যাতে ProductCard ছবি খুঁজে পায়
        featured.push({
          ...firstItem,       // id, image, name, price এখান থেকে আসবে
          categoryFolder: categoryKey // ফোল্ডারের নাম (যেমন: ancient_bengal) আলাদাভাবে রাখলাম
        });
      }
    });
    return featured;
  };

  const featuredProducts = getFeaturedProducts();

  return (
    <Box sx={{ backgroundColor: '#e3f2fd', minHeight: '100vh', pt: 4, pb: 8 }}>
      
      {/* Welcome Section */}
      <Container maxWidth="md">
        <Box 
          sx={{ 
            backgroundColor: '#fffde7', 
            color: '#1b5e20', 
            py: 8, 
            textAlign: 'center', 
            mb: 6,
            borderRadius: '12px', 
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' 
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to CoinHouseMarket
          </Typography>
          <Typography variant="h6" component="p" sx={{ color: '#555' }}>
            produced by Rakib
          </Typography>
        </Box>
      </Container>

      {/* Featured Coins Section */}
      <Container maxWidth="lg" sx={{ my: 4 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{ 
            bgcolor: '#1b5e20', 
            py: 1.5, 
            px: 5, 
            borderRadius: '50px', 
            display: 'inline-block',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Featured Collections
            </Typography>
          </Box>
        </Box>

        {/* Product Grid using ProductCard Component */}
        <Grid container spacing={4} justifyContent="center">
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              
              {/* ✅ সংশোধন: এখানে আমরা এখন সঠিক Props পাঠাচ্ছি */}
              <ProductCard 
                 product={product}              // পুরো প্রোডাক্ট ডাটা পাঠালাম
                 category={product.categoryFolder} // ফোল্ডারের নাম পাঠালাম যাতে ছবি পায়
              />

            </Grid>
          ))}
        </Grid>

        {/* Explore All Button */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Button 
            variant="contained" 
            size="large" 
            // এখানে আপনি চাইলে '/eshop' বা '/category' পেজে নিতে পারেন
            onClick={() => navigate('/eshop')} 
            sx={{ 
              bgcolor: '#1b5e20', 
              '&:hover': { bgcolor: '#004d40' }, 
              px: 5, py: 1.5,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              borderRadius: '8px'
            }}
          >
            EXPLORE ALL COINS &gt;
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;