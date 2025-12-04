// src/pages/AllProductsPage.jsx (ধরে নিচ্ছি আপনার ফাইল স্ট্রাকচার এমন)

import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Card, CardMedia, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import coinData from '../dataWithMeta'; // আপনার ডেটা ফাইলের সঠিক পাথ দিন

const AllProductsPage = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // সব ক্যাটাগরির পণ্য একত্রিত করার লজিক
    const mergedProducts = [];
    Object.keys(coinData).forEach(categoryKey => {
      // প্রতিটি পণ্যের সাথে তার ক্যাটাগরি কী (categoryKey) যোগ করা হচ্ছে
      const productsWithCategory = coinData[categoryKey].map(product => ({
        ...product,
        category: categoryKey // প্রোডাক্ট অবজেক্টে ক্যাটাগরি যোগ করা হলো
      }));
      mergedProducts.push(...productsWithCategory);
    });

    setAllProducts(mergedProducts);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  const handleProductClick = (productId) => {
    // ProductPage-এ যাওয়ার জন্য নেভিগেট করুন (id ব্যবহার করে)
    navigate(`/product/${productId}`);
  };

  return (
    <Box sx={{ py: 6, backgroundColor: '#f6fbf6', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#1b5e20' }}>
          Complete Coin Collection ({allProducts.length} items)
        </Typography>
        
        <Grid container spacing={4}>
          {allProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card 
                onClick={() => handleProductClick(product.id)}
                sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={`/assets/${product.category}/${product.image}`} // সঠিক ইমেজ পাথ
                  alt={product.name}
                  sx={{ objectFit: 'contain', bgcolor: '#fff' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" noWrap>{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{product.year}</Typography>
                  <Typography variant="h6" color="primary">৳{product.price}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AllProductsPage;
