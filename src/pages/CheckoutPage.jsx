import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper, Grid, TextField, 
  Dialog, DialogTitle, DialogContent,
  DialogActions, Divider, List, ListItem, ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';

// --- Courier Options ---
const COURIER_OPTIONS = [
  { id: 'sundarban', name: 'Sundarban Courier' },
  { id: 'sa_paribahan', name: 'SA Paribahan' },
  { id: 'pathao', name: 'Pathao Parcel' },
  { id: 'redx', name: 'RedX' },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();

  // Debug: পেজ লোড হলে কনসোলে মেসেজ দিবে
  useEffect(() => {
    console.log("✅ Checkout Page Loaded Successfully");
  }, []);

  // States
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: ''
  });
  const [courier, setCourier] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); 
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  // Handlers
  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // ফর্ম ভ্যালিডেশন
  const isFormValid = 
    shippingInfo.firstName && 
    shippingInfo.address && 
    shippingInfo.phone && 
    courier && 
    paymentMethod;

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      alert("Your cart is empty!");
      navigate('/');
      return;
    }

    if (!isFormValid) {
      alert("⚠️ Please select Courier, Payment Method and Address!");
      return;
    }

    try {
      const user = localStorage.getItem('user');
      if (!user) {
        setOpenLoginDialog(true);
        return;
      }
    } catch (err) {}

    const orderData = {
      customer: shippingInfo,
      items: items,
      courier: courier,
      paymentMethod: paymentMethod,
      totalAmount: totalPrice,
      date: new Date().toISOString()
    };

    console.log('Order Placed:', orderData);
    alert(`🎉 Order Success!\nVia: ${paymentMethod.toUpperCase()}\nCourier: ${courier}\nTotal: ৳${totalPrice.toLocaleString()}`);

    clearCart();
    navigate('/'); 
  };

  // বাটন স্টাইল (সিলেক্ট করলে সবুজ হবে)
  const getSelectableButtonStyle = (isSelected) => ({
    width: '100%',
    justifyContent: 'space-between',
    textAlign: 'left',
    padding: '15px 20px',
    border: isSelected ? '2px solid #1b5e20' : '1px solid #ccc',
    backgroundColor: isSelected ? '#e8f5e9' : '#fff', // সিলেক্ট হলে হালকা সবুজ ব্যাকগ্রাউন্ড
    color: isSelected ? '#1b5e20' : '#333',
    fontWeight: isSelected ? 'bold' : '500',
    textTransform: 'none',
    borderRadius: '8px',
    marginBottom: '12px',
    boxShadow: isSelected ? '0 0 10px rgba(27, 94, 32, 0.2)' : 'none',
    '&:hover': {
      backgroundColor: '#f1f8e9',
      border: '2px solid #1b5e20',
    }
  });

  return (
    <Box sx={{ padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#1b5e20', textAlign:'center' }}>
        Checkout Process
      </Typography>

      <Grid container spacing={4} maxWidth="xl" sx={{ mx: 'auto' }}>
        {/* --- বাম পাশ --- */}
        <Grid item xs={12} md={7}>
          
          {/* ১. শিপিং ঠিকানা */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display:'flex', alignItems:'center', gap:1 }}>
              <span style={{background:'#1b5e20', color:'white', borderRadius:'50%', width:25, height:25, display:'flex', justifyContent:'center', alignItems:'center', fontSize:14}}>1</span>
              Shipping Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="First Name" name="firstName" fullWidth required onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Last Name" name="lastName" fullWidth onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Address" name="address" fullWidth required multiline rows={2} placeholder="Full Address" onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Phone Number" name="phone" fullWidth required type="number" onChange={handleInputChange} />
              </Grid>
            </Grid>
          </Paper>

          {/* ২. কুরিয়ার নির্বাচন */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display:'flex', alignItems:'center', gap:1 }}>
              <span style={{background:'#1b5e20', color:'white', borderRadius:'50%', width:25, height:25, display:'flex', justifyContent:'center', alignItems:'center', fontSize:14}}>2</span>
              Select Courier Service
            </Typography>
            <Grid container spacing={2}>
              {COURIER_OPTIONS.map((option) => (
                <Grid item xs={12} sm={6} key={option.id}>
                  <Button
                    onClick={() => setCourier(option.name)}
                    sx={getSelectableButtonStyle(courier === option.name)}
                  >
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <LocalShippingIcon color={courier === option.name ? "success" : "action"} />
                      {option.name}
                    </Box>
                    {courier === option.name && <CheckCircleIcon color="success" />}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* ৩. পেমেন্ট মেথড */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display:'flex', alignItems:'center', gap:1 }}>
              <span style={{background:'#1b5e20', color:'white', borderRadius:'50%', width:25, height:25, display:'flex', justifyContent:'center', alignItems:'center', fontSize:14}}>3</span>
              Payment Method
            </Typography>
            
            {/* বাংলাদেশী পেমেন্ট */}
            <Typography variant="subtitle2" sx={{ color: '#1b5e20', fontWeight: 'bold', mt: 1, mb: 2 }}>
              ONLINE MOBILE PAYMENT (BD)
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {/* Bkash */}
              <Grid item xs={12} sm={4}>
                <Button onClick={() => setPaymentMethod('bkash')} sx={getSelectableButtonStyle(paymentMethod === 'bkash')}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <img src="/assets/logos/bkash.png" alt="bKash" width="30" onError={(e)=>{e.target.style.display='none'}} />
                    bKash
                  </Box>
                  {paymentMethod === 'bkash' && <CheckCircleIcon color="success" />}
                </Button>
              </Grid>
              {/* Nagad */}
              <Grid item xs={12} sm={4}>
                <Button onClick={() => setPaymentMethod('nagad')} sx={getSelectableButtonStyle(paymentMethod === 'nagad')}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <img src="/assets/logos/nagad.png" alt="Nagad" width="30" onError={(e)=>{e.target.style.display='none'}} />
                    Nagad
                  </Box>
                  {paymentMethod === 'nagad' && <CheckCircleIcon color="success" />}
                </Button>
              </Grid>
              {/* Rocket */}
              <Grid item xs={12} sm={4}>
                <Button onClick={() => setPaymentMethod('rocket')} sx={getSelectableButtonStyle(paymentMethod === 'rocket')}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <img src="/assets/logos/rocket.png" alt="Rocket" width="30" onError={(e)=>{e.target.style.display='none'}} />
                    Rocket
                  </Box>
                  {paymentMethod === 'rocket' && <CheckCircleIcon color="success" />}
                </Button>
              </Grid>
            </Grid>

            {/* আন্তর্জাতিক পেমেন্ট */}
            <Typography variant="subtitle2" sx={{ color: '#003087', fontWeight: 'bold', mb: 2 }}>
              FOR GLOBALLY PAYMENT
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Button onClick={() => setPaymentMethod('paypal')} sx={getSelectableButtonStyle(paymentMethod === 'paypal')}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <img src="/assets/logos/paypal.jpg" alt="PayPal" width="30" style={{borderRadius:4}} onError={(e)=>{e.target.style.display='none'}} />
                    PayPal (International)
                  </Box>
                  {paymentMethod === 'paypal' && <CheckCircleIcon color="success" />}
                </Button>
              </Grid>
            </Grid>

            {/* অন্যান্য */}
            <Typography variant="subtitle2" sx={{ color: '#555', fontWeight: 'bold', mb: 2 }}>
              OTHER
            </Typography>
            <Button onClick={() => setPaymentMethod('cod')} sx={getSelectableButtonStyle(paymentMethod === 'cod')}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <PaymentIcon color="action" />
                Cash On Delivery
              </Box>
              {paymentMethod === 'cod' && <CheckCircleIcon color="success" />}
            </Button>
            
          </Paper>
        </Grid>

        {/* --- ডান পাশ: অর্ডার সামারি --- */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, position: 'sticky', top: 20, borderRadius: 2, border: '1px solid #ddd' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
              Order Summary
            </Typography>

            <List disablePadding sx={{ maxHeight: '40vh', overflow: 'auto', mb: 2 }}>
              {items.map((item, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1.5, borderBottom: '1px dashed #eee' }}>
                  <ListItemText 
                    primary={item.name} 
                    secondary={`Quantity: ${item.quantity}`} 
                  />
                  <Typography fontWeight="bold">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </ListItem>
              ))}
            </List>

            {items.length === 0 && (
               <Typography color="error" align="center" sx={{py:2}}>Your cart is empty!</Typography>
            )}

            <Box sx={{ mt: 3, p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography fontWeight="bold">৳{totalPrice.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography color="text.secondary">Shipping</Typography>
                    <Typography fontWeight="bold" color="success.main">Free</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">Total</Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                        ৳{totalPrice.toLocaleString()}
                    </Typography>
                </Box>
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handlePlaceOrder}
              disabled={items.length === 0 || !isFormValid}
              sx={{ 
                  mt: 3, 
                  py: 1.5, 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(27,94,32,0.3)' 
              }}
            >
              {isFormValid ? "Checkout Now" : "Fill Details to Checkout"}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Login Dialog */}
      <Dialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography>Please login to place your order.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoginDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { setOpenLoginDialog(false); navigate('/login'); }}>
            Login Now
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default CheckoutPage;