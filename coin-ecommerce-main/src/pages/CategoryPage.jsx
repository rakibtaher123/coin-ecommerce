import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Card, CardMedia, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { useCart } from '../context/CartProvider'; 
import { useProducts } from '../context/ProductContext';

const CategoryPage = () => {
  const { id } = useParams(); // URL থেকে id আসছে (যেমন: janapada_series)
  const navigate = useNavigate();
  const { addToCart } = useCart(); 
  const { products, loading } = useProducts();

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  // === সমস্যা সমাধানের লজিক ===
  // URL এর নাম থেকে সব স্পেস এবং চিহ্ন সরিয়ে ফেলা (janapada_series -> janapadaseries)
  const cleanUrlId = id ? id.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

  let filteredProducts = [];
  let title = 'CATEGORY';

  if (id === 'all') {
    filteredProducts = products;
    title = 'ALL COINS';
  } else {
    // ডাটাবেসের ক্যাটাগরি নামও ক্লিন করে ম্যাচ করানো
    filteredProducts = products.filter(item => {
      if (!item.category) return false;
      const cleanDbCat = item.category.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanDbCat === cleanUrlId;
    });

    title = id.replace(/_/g, ' ').toUpperCase();
  }

  return (
    <Box sx={{ py: 5, backgroundColor: '#f4f9f4', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Button onClick={() => navigate('/eshop')} sx={{ mb: 3, color: '#1b5e20' }}>← Back to Categories</Button>
        
        <Typography variant="h4" sx={{ mb: 4, color: '#1b5e20', fontWeight: 'bold', textAlign: 'center' }}>
          {title} COLLECTION
        </Typography>

        {filteredProducts.length > 0 ? (
          <Grid container spacing={3}>
            {filteredProducts.map((item) => (
              <Grid item key={item._id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 6 } }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={item.image}
                    alt={item.name}
                    sx={{ objectFit: 'contain', p: 2, bgcolor: '#fafafa' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">{item.name}</Typography>
                    
                    <Typography variant="body2" sx={{ mt: 1, color: item.countInStock > 0 ? 'green' : 'red' }}>
                       {item.countInStock > 0 ? `In Stock: ${item.countInStock}` : 'Out of Stock'}
                    </Typography>

                    <Typography variant="body1" color="success.main" fontWeight="bold" sx={{ my: 1 }}>
                      Price: ৳{item.price}
                    </Typography>
                    
                    <Button 
                      variant="outlined"
                      sx={{ mt: 2, mr: 1, color: '#1b5e20', borderColor: '#1b5e20' }}
                      onClick={() => navigate(`/product/${item._id}`)}
                    >
                      View Details
                    </Button>

                    <Button 
                      variant="contained" 
                      sx={{ mt: 2, bgcolor: '#1b5e20', '&:hover': { bgcolor: '#004d40' } }}
                      disabled={item.countInStock === 0}
                      onClick={() => addToCart(item)} 
                    >
                      {item.countInStock === 0 ? 'Sold Out' : 'Add to Cart'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" mt={5}>
            <Typography variant="h6" color="error">No coins found!</Typography>
            <Typography variant="body2">
               Please check if products are loaded in "All Products" page first.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CategoryPage;