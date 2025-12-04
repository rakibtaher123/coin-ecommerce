import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, totalPrice, itemCount, removeFromCart } = useCart();

  // ✅ আপডেট করা চেকআউট লজিক
  const handleCheckoutClick = () => {
    // সরাসরি Checkout পেজে নিয়ে যাবে (Testing এর জন্য লগইন চেক বন্ধ রাখা হয়েছে)
    // তুমি চাইলে পরে লগইন চেক আবার চালু করতে পারো
    navigate('/checkout');
    
    /* // পুরাতন লগইন চেক কোড (ভবিষ্যতে ব্যবহারের জন্য রাখা হলো)
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
    */
  };

  // --- কার্ট খালি থাকলে ---
  if (itemCount === 0) {
    return (
      <Box sx={{ py: 10, backgroundColor: '#f4f6f8', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ mb: 2 }}>🛒</Typography>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#555' }}>
            Your Cart is Empty
          </Typography>
          <Button
            onClick={() => navigate('/eshop')}
            variant="contained"
            size="large"
            sx={{ mt: 3, bgcolor: '#1b5e20' }}
          >
            Browse Collections
          </Button>
        </Container>
      </Box>
    );
  }

  // --- কার্ট ভরা থাকলে (সুন্দর গ্রিড লেআউট) ---
  return (
    <Box sx={{ py: 5, backgroundColor: '#f4f6f8', minHeight: '90vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: '#1b5e20' }}>
          Shopping Cart ({itemCount} items)
        </Typography>

        <Grid container spacing={4}>
          {/* বাম পাশ: প্রোডাক্ট লিস্ট */}
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
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <img
                            src={item.image ? `/assets/${item.category}/${item.image}` : 'https://via.placeholder.com/50'}
                            alt={item.name}
                            style={{ 
                              width: 60, 
                              height: 60, 
                              objectFit: 'cover', 
                              borderRadius: '8px',
                              marginRight: '15px',
                              border: '1px solid #eee'
                            }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                          />
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">{item.name}</Typography>
                            <Typography variant="caption" color="text.secondary">ID: {item.id}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">৳{item.price}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ border: '1px solid #ddd', borderRadius: '4px', px: 2, py: 0.5, display: 'inline-block', fontWeight: 'bold' }}>
                          {item.quantity}
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="error" onClick={() => removeFromCart(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* ডান পাশ: অর্ডার সামারি এবং চেকআউট বাটন */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 100 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee', pb: 2 }}>
                Order Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 2 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight="bold">৳{totalPrice.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Delivery</Typography>
                <Typography color="text.secondary" fontSize={14}>Select at checkout</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h5" fontWeight="bold" color="#1b5e20">
                  ৳{totalPrice.toLocaleString()}
                </Typography>
              </Box>

              {/* ✅ CHECKOUT BUTTON */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleCheckoutClick}
                sx={{ 
                  bgcolor: '#1b5e20', 
                  py: 1.5, 
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 16px rgba(27,94,32,0.2)',
                  '&:hover': { bgcolor: '#004d40' }
                }}
              >
                PROCEED TO CHECKOUT
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CartPage;