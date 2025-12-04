import React from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import coinData from '../dataWithMeta'; // নিশ্চিত করো পাথ ঠিক আছে

const HomePage = () => {
  const navigate = useNavigate();

  // --- Featured Products Logic ---
  const getFeaturedProducts = () => {
    if (!coinData) return []; // ডাটা না থাকলে এরর এড়াতে
    
    const featured = [];
    const categories = Object.keys(coinData);

    // প্রথম ৬টি ক্যাটাগরি থেকে ১টি করে প্রোডাক্ট নেওয়া
    categories.slice(0, 6).forEach((categoryKey) => {
      const items = coinData[categoryKey];

      if (items && items.length > 0) {
        const firstItem = items[0];
        
        // প্রোডাক্টের সাথে ক্যাটাগরি ফোল্ডারের নাম যুক্ত করা হচ্ছে
        featured.push({
          ...firstItem,
          categoryFolder: categoryKey, 
        });
      }
    });

    return featured;
  };

  const featuredProducts = getFeaturedProducts();

  return (
    <Box sx={{ backgroundColor: '#e3f2fd', minHeight: '100vh', pt: 4, pb: 8 }}>
      
      {/* --- Welcome Section --- */}
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: '#fffde7',
            color: '#1b5e20',
            py: 8,
            textAlign: 'center',
            mb: 6,
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Welcome to CoinHouseMarket
          </Typography>
          <Typography variant="h6" sx={{ color: '#555' }}>
            produced by Rakib
          </Typography>
        </Box>
      </Container>

      {/* --- Featured Products Grid --- */}
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box
            sx={{
              bgcolor: '#1b5e20',
              py: 1.5,
              px: 5,
              borderRadius: '50px',
              display: 'inline-block',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}
            >
              Featured Collections
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              {/* ✅ ProductCard এ ডাটা পাস করা হচ্ছে */}
              <ProductCard
                product={product} 
                category={product.categoryFolder} // এই লাইনটি Add to Cart এবং Image লোড করার জন্য জরুরি
              />
            </Grid>
          ))}
        </Grid>

        {/* --- Explore Button --- */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/eshop')}
            sx={{
              bgcolor: '#1b5e20',
              '&:hover': { bgcolor: '#004d40' },
              px: 5,
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              borderRadius: '8px',
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