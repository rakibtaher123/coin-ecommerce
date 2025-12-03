import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import coinData from '../dataWithMeta';
import { useCart } from '../context/CartProvider'; 

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); 

  let products = [];
  let title = 'CATEGORY';

  if (id === 'all') {
    // Flatten all categories into a single products array and keep category key for image path
    products = Object.entries(coinData).flatMap(([catKey, arr]) => arr.map(item => ({ ...item, __category: catKey })));
    title = 'ALL COINS';
  } else {
    products = (coinData[id] || []).map(item => ({ ...item, __category: id }));
    title = id ? id.replace(/_/g, ' ').toUpperCase() : 'CATEGORY';
  }

  return (
    <Box sx={{ py: 5, backgroundColor: '#f4f9f4', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Button onClick={() => navigate('/eshop')} sx={{ mb: 3, color: '#1b5e20' }}>← Back to Categories</Button>
        
        <Typography variant="h4" sx={{ mb: 4, color: '#1b5e20', fontWeight: 'bold', textAlign: 'center' }}>
          {title} COLLECTION
        </Typography>

        {products.length > 0 ? (
          <Grid container spacing={3}>
            {products.map((item, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 6 } }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={`/assets/${item.__category}/${item.image}`}
                    alt={item.name}
                    sx={{ objectFit: 'contain', p: 2, bgcolor: '#fafafa' }}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">{item.name}</Typography>
                    {/* Show year if available */}
                    {item.year && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Year: {item.year}
                      </Typography>
                    )}

                    <Typography variant="body1" color="success.main" fontWeight="bold" sx={{ my: 1 }}>
                      Price: ৳{item.price}
                    </Typography>
                    
                    {/* Two action buttons: View Details + Add to Cart */}
                    <Button 
                      variant="outlined"
                      sx={{ mt: 2, mr: 1, color: '#1b5e20', borderColor: '#1b5e20' }}
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      View Details
                    </Button>

                    <Button 
                      variant="contained" 
                      sx={{ mt: 2, bgcolor: '#1b5e20', '&:hover': { bgcolor: '#004d40' } }}
                      onClick={() => addToCart({ ...item, category: item.__category || id })} 
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" mt={5}>
            <Typography variant="h6" color="error">No coins found!</Typography>
            <Typography>Please check if you added image names in <b>src/data.js</b> correctly.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CategoryPage;