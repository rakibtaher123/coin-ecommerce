import React from 'react';
import { Box, Container, Typography, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Paper, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartProvider';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  const handleCheckoutClick = () => {
    // If user logged in (mock user stored in localStorage) go to checkout
    try {
      const user = localStorage.getItem('user');
      if (user) {
        navigate('/checkout');
        return;
      }
    } catch (err) {
      // ignore
    }

    // Not logged in -> go to login and set redirect back to checkout
    navigate('/login?redirect=/checkout');
  };

  return (
    <Box sx={{ py: 8, minHeight: '90vh', backgroundColor: '#e3f2fd' }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1b5e20', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
            Shopping Cart ({cart.length})
          </Typography>

          {cart.length === 0 ? (
            <Box textAlign="center" py={5}>
              <Typography variant="h6" color="text.secondary" paragraph>Your cart is currently empty.</Typography>
              <Button onClick={() => navigate('/eshop')} variant="contained" sx={{ mt: 2, bgcolor: '#1b5e20' }}>
                Browse Coins
              </Button>
            </Box>
          ) : (
            <>
              <List>
                {cart.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem secondaryAction={
                      <IconButton edge="end" onClick={() => removeFromCart(item.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    }>
                      <ListItemAvatar>
                        <Avatar 
                          src={`/assets/${item.category}/${item.image}`} 
                          variant="rounded" 
                          sx={{ width: 60, height: 60, mr: 2, bgcolor: '#f5f5f5', objectFit: 'contain' }} 
                        />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography variant="h6">{item.name}</Typography>}
                        secondary={`Price: ৳${item.price}`} 
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
              
              <Box sx={{ mt: 4, textAlign: 'right', pt: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                  Total: ৳{totalPrice}
                </Typography>
                <Button 
                  variant="contained" 
                  size="large" 
                  sx={{ mt: 2, bgcolor: '#1b5e20', '&:hover': { bgcolor: '#004d40' }, px: 5 }}
                  onClick={handleCheckoutClick}
                >
                  Checkout Now
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CartPage;