import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  TextField,
  Box, // Box import is good practice for container styling
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider'; 

function ProductCard({ product, category }) {
  const navigate = useNavigate();
  // useCart hook correctly consumes the context values
  const { addToCart } = useCart(); 
  const [qty, setQty] = useState(1);

  // Safety check: if the product data isn't passed, don't render anything
  if (!product || !product.id) return null;

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = () => {
    // 1. Quantity validation
    if (qty < 1 || !product.price) {
        alert("Quantity must be 1 or more, or product price is missing.");
        return;
    }
    
    // 2. Data check for debugging (HELPER FOR YOU)
    const itemToAdd = { 
        ...product, 
        category: category,
        // Ensure price is treated as a number before sending to cart
        price: Number(product.price)
    };
    
    console.log('Attempting to add to cart:', itemToAdd, 'Quantity:', qty);

    // 3. Call Context function
    addToCart(itemToAdd, qty);
  };

  // Image path construction
  const imagePath = category
    ? `/assets/${category}/${product.image}`
    : `/assets/${product.image}`;

  // Ensure price is a number for formatting safety
  const displayPrice = Number(product.price) || 0;


  return (
    <Card sx={{ width: 260, m: 'auto' }} elevation={3}>
      <CardMedia
        component="img"
        height="200"
        image={imagePath || 'https://via.placeholder.com/200'}
        alt={product.name}
        onClick={handleViewDetails}
        sx={{ cursor: 'pointer', objectFit: 'cover' }}
        onError={(e) => { 
          e.target.src = 'https://via.placeholder.com/200'; // Fallback image
        }}
      />

      <CardContent sx={{ pb: 1 }}>
        <Typography 
          fontWeight="bold" 
          sx={{ cursor: 'pointer', height: 40, overflow: 'hidden' }} 
          onClick={handleViewDetails}
        >
          {product.name}
        </Typography>

        <Typography color="primary" variant="h6" fontWeight="bold" sx={{ my: 1 }}>
          ৳{displayPrice.toLocaleString()} 
        </Typography>

        <TextField
          type="number"
          size="small"
          label="Qty"
          value={qty}
          inputProps={{ min: 1 }}
          // Ensure quantity is updated as a Number
          onChange={(e) => {
            const val = Number(e.target.value);
            setQty(val > 0 ? val : 1);
          }}
          sx={{ width: '90px' }}
        />
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
        <Button size="small" variant="outlined" onClick={handleViewDetails}>
          View Details
        </Button>

        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
        >
          Add
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;