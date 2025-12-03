import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';

function ProductCard({ product, category }) {
  const navigate = useNavigate();
  const cart = useCart();

  // ⚠️ Safety Check
  if (!product) {
    return null;
  }

  const handleViewDetails = () => {
    // ✅ MongoDB থেকে আসা ডাটায় _id থাকে
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = () => {
    cart.addToCart({ ...product, category });
  };

  // ✅ ছবির সঠিক পাথ তৈরি করা
  const imagePath = category 
    ? `/assets/${category}/${product.image}` 
    : `/assets/${product.image}`;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={2}>
      <CardMedia
        component="img"
        height="200"
        image={imagePath || "https://via.placeholder.com/200?text=No+Image"}
        alt={product.name}
        onClick={handleViewDetails}
        sx={{ cursor: 'pointer', objectFit: 'cover' }}
        onError={(e) => { e.target.src = "https://via.placeholder.com/200?text=No+Image"; }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="div" 
          sx={{ cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }} 
          onClick={handleViewDetails}
        >
          {product.name}
        </Typography>
        
        {(product.year || product.details) && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {product.year ? `Year: ${product.year}` : ''}
            {product.details ? (product.year ? ` • ${product.details}` : product.details) : ''}
          </Typography>
        )}

        <Typography variant="h6" color="primary" sx={{ marginY: 1, fontWeight: 'bold' }}>
          ৳{product.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="outlined" onClick={handleViewDetails}>
          View Details
        </Button>
        <Button size="small" variant="contained" startIcon={<AddShoppingCart />} onClick={handleAddToCart}>
          Add
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
