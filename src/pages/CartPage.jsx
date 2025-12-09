<<<<<<< HEAD
import React from 'react';
import {
  Box, Container, Typography, Button, Paper, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Divider, Grid, TextField
=======
import React, { useState } from 'react';
import {
  Box, Container, Typography, Button, Paper, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Divider, Grid, TextField, CircularProgress
>>>>>>> 2380bf3efe74b80de5153606f9a8946bb69620e6
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';

const CartPage = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
  
  // ✅ SAFETY FIX: Default to empty array [] if cartItems is undefined
  const { cartItems = [], totalPrice, removeFromCart } = useCart();
=======
  const [loading, setLoading] = useState(false); // লোডিং স্টেট
  
  // ✅ useCart থেকে clearCart ফাংশনটি আনা হয়েছে (যদি তোমার Context-এ থাকে)
  const { cartItems = [], totalPrice, removeFromCart, clearCart } = useCart();
>>>>>>> 2380bf3efe74b80de5153606f9a8946bb69620e6

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    return imagePath.startsWith('http') ? imagePath : `http://localhost:5000${imagePath}`;
  };

<<<<<<< HEAD
  const handleCheckoutClick = () => {
    navigate('/checkout');
=======
  // ✅ নতুন হ্যান্ডলার: এটি সরাসরি ডাটাবেসে অর্ডার পাঠাবে
  const handleCheckoutClick = async () => {
    // ১. লগইন চেক
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first to place an order!");
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // ২. কনফার্মেশন
    const confirmOrder = window.confirm("Are you sure you want to place this order via Cash on Delivery?");
    if (!confirmOrder) return;

    setLoading(true);

    // ৩. অর্ডারের ডাটা প্রস্তুত করা
    // (যেহেতু আলাদা চেকআউট পেজ নেই, তাই আমরা ডিফল্ট এড্রেস দিচ্ছি যাতে অর্ডার সেভ হয়)
    const orderData = {
        orderItems: cartItems.map(item => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id
        })),
        shippingAddress: {
            address: "Dhaka, Bangladesh",
            city: "Dhaka",
            postalCode: "1200",
            country: "Bangladesh"
        },
        paymentMethod: "Cash On Delivery", // ডিফল্ট পেমেন্ট মেথড
        itemsPrice: totalPrice,
        taxPrice: 0,
        shippingPrice: 60, // শিপিং চার্জ (চাইলে বদলাতে পারো)
        totalPrice: totalPrice + 60 
    };

    try {
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // টোকেন পাঠানো হচ্ছে
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Order Placed Successfully!");
            
            // কার্ট খালি করা (যদি ফাংশনটি থাকে)
            if (clearCart) clearCart(); 
            else window.location.reload(); // অথবা পেজ রিলোড

            // অর্ডার লিস্ট পেজে নিয়ে যাওয়া (যদি থাকে) বা হোম পেজে
            navigate('/profile'); // অথবা '/'
        } else {
            alert("Order Failed: " + (data.message || "Unknown Error"));
        }

    } catch (error) {
        console.error("Order Error:", error);
        alert("Server Error! Check console.");
    } finally {
        setLoading(false);
    }
>>>>>>> 2380bf3efe74b80de5153606f9a8946bb69620e6
  };

  // Handle empty or loading state safely
  if (!cartItems || cartItems.length === 0) {
    return (
      <Box sx={{ py: 10, backgroundColor: '#f4f6f8', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ mb: 2 }}>🛒</Typography>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#555' }}>
            Your Cart is Empty
          </Typography>
          <Button onClick={() => navigate('/eshop')} variant="contained" size="large" sx={{ mt: 3, bgcolor: '#1b5e20' }}>
            Browse Collections
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 5, backgroundColor: '#f4f6f8', minHeight: '90vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: '#1b5e20' }}>
          Shopping Cart ({cartItems.length} items)
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#e8f5e9' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Product Details</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Price</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: '8px', marginRight: '15px', border: '1px solid #eee', backgroundColor: 'white' }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=No+Image'; }}
                          />
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">{item.name}</Typography>
                            <Typography variant="caption" color="text.secondary">Cat: {item.category}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">৳{item.price}</TableCell>
                      <TableCell align="center">
                         <TextField type="number" size="small" value={item.qty} inputProps={{ min: 1, style: { textAlign: 'center' }, readOnly: true }} sx={{ width: 60 }} />
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                        ৳{(item.price * item.qty).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="error" onClick={() => removeFromCart(item._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 100 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee', pb: 2 }}>Order Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 2 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight="bold">৳{totalPrice.toLocaleString()}</Typography>
              </Box>
<<<<<<< HEAD
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h5" fontWeight="bold" color="#1b5e20">৳{totalPrice.toLocaleString()}</Typography>
              </Box>
              <Button variant="contained" size="large" fullWidth onClick={handleCheckoutClick} sx={{ bgcolor: '#1b5e20', py: 1.5, '&:hover': { bgcolor: '#004d40' } }}>
                PROCEED TO CHECKOUT
=======
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography fontWeight="bold">৳60</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h5" fontWeight="bold" color="#1b5e20">৳{(totalPrice + 60).toLocaleString()}</Typography>
              </Box>
              
              <Button 
                variant="contained" 
                size="large" 
                fullWidth 
                onClick={handleCheckoutClick} 
                disabled={loading}
                sx={{ bgcolor: '#1b5e20', py: 1.5, '&:hover': { bgcolor: '#004d40' } }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "PLACE ORDER"}
>>>>>>> 2380bf3efe74b80de5153606f9a8946bb69620e6
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CartPage;