import React, { useState } from 'react';
import { Box, Container, Grid, Card, CardMedia, CardContent, Typography, Button, TextField } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import coinData from '../dataWithMeta';
import { useCart } from '../context/CartProvider';

// Product detail page. Shows year, description, price and Add to Cart.
const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cart = useCart();
  const [qty, setQty] = useState(1);

  // find product across categories
  let product = null;
  let productCategory = null;
  Object.keys(coinData).some((cat) => {
    const found = coinData[cat].find((p) => p.id === id);
    if (found) {
      product = found;
      productCategory = cat;
      return true;
    }
    return false;
  });

  if (!product) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5">Product not found</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );
  }

  const imagePath = productCategory ? `/assets/${productCategory}/${product.image}` : `/assets/${product.image}`;

  const handleAddToCart = () => {
    const item = { ...product, category: productCategory, quantity: qty };
    cart.addToCart(item);
    navigate('/cart');
  };

  return (
    <Box sx={{ py: 6, backgroundColor: '#f6fbf6', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                image={imagePath}
                alt={product.name}
                sx={{ objectFit: 'contain', width: '100%', maxHeight: 540, bgcolor: '#fff' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>{product.name}</Typography>
            {product.year && (
              <Typography variant="subtitle1" sx={{ mt: 1, color: 'text.secondary' }}>Published: {product.year}</Typography>
            )}

            {product.details && (
              <Typography variant="body1" sx={{ mt: 2 }}>{product.details}</Typography>
            )}

            <Typography variant="h5" sx={{ mt: 3, fontWeight: 'bold' }}>Price: ৳{product.price}</Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 4 }}>
              <TextField
                label="Quantity"
                type="number"
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))}
                inputProps={{ min: 1 }}
                sx={{ width: 120 }}
              />

              <Button variant="contained" color="success" onClick={handleAddToCart} sx={{ py: 1.5 }}>
                Add to Cart
              </Button>

              <Button variant="outlined" onClick={() => navigate(`/category/${productCategory}`)}>
                View Collection
              </Button>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Button onClick={() => navigate(-1)}>&larr; Back</Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductPage;