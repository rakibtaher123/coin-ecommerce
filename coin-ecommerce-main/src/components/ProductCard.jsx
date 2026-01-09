import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  TextField,
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';

// API URL (ইমেজ লোডিংয়ের জন্য)
const API_BASE_URL = "https://gangaridai-auction.onrender.com";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  // ✅ স্টক লজিক (ডাটাবেস থেকে)
  const stock = product.countInStock !== undefined ? product.countInStock : 0;

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`); // MongoDB _id ব্যবহার হবে
  };

  const handleAddToCart = () => {
    if (stock === 0) {
      alert("This item is Out of Stock!");
      return;
    }
    if (qty > stock) {
      alert(`Sorry! We only have ${stock} items in stock.`);
      return;
    }
    
    // কার্টে অ্যাড করা
    addToCart({ ...product, price: Number(product.price) }, Number(qty));
  };

  // ✅ ইমেজ পাথ ফিক্স (Dynamic)
  const getImage = () => {
    if (!product.image) return 'https://via.placeholder.com/200';

    // ১. যদি ডাটাবেস ইমেজে http থাকে (অনলাইন লিংক)
    if (product.image.startsWith('http')) {
        return product.image;
    }
    
    // ২. যদি লোকাল সার্ভার ইমেজ হয় (/assets/...)
    // আমাদের সিড ফাইলে পাথ /assets/.. হিসেবে সেভ করা আছে
    return product.image; 
  };

  return (
    <Card sx={{ width: 260, m: 'auto', boxShadow: 3, height: '100%', display: 'flex', flexDirection: 'column' }} elevation={3}>
      <CardMedia
        component="img"
        height="180"
        image={getImage()}
        alt={product.name}
        onClick={handleViewDetails}
        sx={{ cursor: 'pointer', objectFit: 'contain', p: 2, bgcolor: '#f9f9f9' }}
        onError={(e) => { 
          e.target.src = 'https://via.placeholder.com/200?text=No+Image'; 
        }}
      />

      <CardContent sx={{ pb: 1, flexGrow: 1 }}>
        <Typography 
          fontWeight="bold" 
          variant="subtitle1"
          sx={{ cursor: 'pointer', height: 45, overflow: 'hidden', lineHeight: 1.2, mb: 1 }} 
          onClick={handleViewDetails}
        >
          {product.name}
        </Typography>

        <Typography color="primary" variant="h6" fontWeight="bold">
          ৳{Number(product.price).toLocaleString()} 
        </Typography>

        {/* ✅ ডাইনামিক স্টক স্ট্যাটাস */}
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: stock > 0 ? 'green' : 'red', display: 'block', mb: 1 }}>
          {stock > 0 ? `In Stock (${stock})` : 'Out of Stock'}
        </Typography>

        <TextField
          type="number"
          size="small"
          label="Qty"
          value={qty}
          inputProps={{ min: 1, max: stock > 0 ? stock : 1 }}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val > 0 && val <= stock) setQty(val);
          }}
          sx={{ width: '100px' }}
          disabled={stock === 0}
        />
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button size="small" variant="outlined" onClick={handleViewDetails}>
          Details
        </Button>

        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          Add
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
