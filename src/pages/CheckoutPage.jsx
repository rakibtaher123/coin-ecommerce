import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Grid, TextField, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CheckoutPage() {
  const navigate = useNavigate();
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  const handlePlaceOrder = () => {
    // Check if user is logged in (mock login stores user in localStorage)
    try {
      const user = localStorage.getItem('user');
      if (user) {
        // Proceed with order flow (demo)
        console.log('Proceeding to place order (demo).');
        // In a real app you would call your backend here and redirect to a confirmation page
        return;
      }
    } catch (err) {
      // ignore and show login dialog
    }

    // Not logged in —  user to login/register
    setOpenLoginDialog(true);
  };
  return (
    <Paper sx={{ padding: '32px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>

      <Grid container spacing={4}>
        {/* Column 1: Shipping Details */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>Shipping Address</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="First Name" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Last Name" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Address" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Phone Number" fullWidth />
            </Grid>
          </Grid>
        </Grid>

        {/* Column 2: Payment & Courier */}
        <Grid item xs={12} md={5}>
          {/* Courier Service Button (Shipping System) */}
          <Box sx={{ marginBottom: '24px' }}>
            <Typography variant="h6" gutterBottom>
              Choose Courier Service
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Courier Service</InputLabel>
              <Select label="Courier Service" defaultValue="">
                <MenuItem value="sundarban">Sundarban Courier</MenuItem>
                <MenuItem value="sa_paribahan">SA Paribahan</MenuItem>
                <MenuItem value="pathao">Pathao Parcel</MenuItem>
                <MenuItem value="redx">RedX</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Payments (Frontend -> Backend) */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 2 }}
              startIcon={<Box component="img" src="/assets/logos/bkash.svg" alt="bKash" sx={{ width: 36, height: 24, objectFit: 'contain' }} />}
            >
              Pay with bKash
            </Button>

            <Button
              variant="contained"
              fullWidth
              sx={{ marginBottom: '10px', backgroundColor: '#e2136e', '&:hover': { backgroundColor: '#c0105c' }, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 2 }}
              startIcon={<Box component="img" src="/assets/logos/nagad.svg" alt="Nagad" sx={{ width: 36, height: 24, objectFit: 'contain' }} />}
            >
              Pay with Nagad
            </Button>

            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#0067b8', '&:hover': { backgroundColor: '#00539a' }, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 2 }}
              startIcon={<Box component="img" src="/assets/logos/rocket.svg" alt="Rocket" sx={{ width: 36, height: 24, objectFit: 'contain' }} />}
            >
              Pay with Rocket
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ textAlign: 'center', marginTop: '32px' }}>
        <Button variant="contained" color="primary" size="large" sx={{ padding: '10px 40px' }} onClick={handlePlaceOrder}>
          Place Order
        </Button>
      </Box>

      <Dialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)}>
        <DialogTitle>Login required</DialogTitle>
        <DialogContent>
          <Typography>Please login or create an account to complete your order.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenLoginDialog(false); navigate('/register'); }}>Create account</Button>
          <Button variant="contained" onClick={() => { setOpenLoginDialog(false); navigate('/login'); }}>Login</Button>
        </DialogActions>
      </Dialog>
      
    </Paper>
  );
}

export default CheckoutPage;