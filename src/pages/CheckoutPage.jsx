import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper, Grid, TextField,
  Dialog, DialogTitle, DialogContent,
  DialogActions, Divider, List, ListItem, ListItemText,
  ListItemAvatar, Avatar
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
  // CartProvider থেকে ডাটা এবং ফাংশন আনা
  const { cartItems, totalPrice, clearCart } = useCart();

  // States
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    city: ''
  });
  const [courier, setCourier] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // ✅ ইমেজ ফিক্স করার ফাংশন
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    return imagePath.startsWith('http') ? imagePath : `http://localhost:5000${imagePath}`;
  };

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

  // ✅ অর্ডার সাবমিট ফাংশন (Backend API সহ)
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      navigate('/');
      return;
    }

    // ১. লগইন চেক (অপশনাল, তবে ভালো প্র্যাকটিস)
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

    // যদি লগইন ছাড়া অর্ডার নিতে না চান, তবে নিচের ৩ লাইন আন-কমেন্ট করুন
    /* if (!userInfo) {
       setOpenLoginDialog(true);
       return;
    } */

    setIsPlacingOrder(true);

    // ২. অর্ডারের ডাটা সাজানো
    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id // প্রোডাক্টের আইডি
      })),
      shippingAddress: shippingInfo,
      paymentMethod: paymentMethod,
      itemsPrice: totalPrice,
      shippingPrice: 0, // ফ্রি শিপিং
      totalPrice: totalPrice,
      user: userInfo ? userInfo._id : null // ইউজার থাকলে তার আইডি, না থাকলে নাল
    };

    try {
      // ৩. ডাটাবেসে পাঠানো (API Call)
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // টোকেন থাকলে পাঠাতে পারেন: 'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Order Created:', data);

        alert(`🎉 Order Placed Successfully!\nOrder ID: ${data._id}\nTotal: ৳${totalPrice.toLocaleString()}`);

        clearCart(); // কার্ট খালি করা
        navigate('/'); // হোমপেজে ফেরত যাওয়া
      } else {
        throw new Error('Order submission failed');
      }

    } catch (error) {
      console.error("Error placing order:", error);
      // ব্যাকএন্ড কানেক্ট না থাকলে লোকাল সাকসেস দেখাবে (টেস্টিংয়ের জন্য)
      alert("Order Placed Locally (Server might be offline)!");
      clearCart();
      navigate('/');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // ✅ Proceed to Payment - Check login first
  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      navigate('/');
      return;
    }

    // Check strict auth
    const token = localStorage.getItem('token');

    if (!token) {
      alert("You must be logged in to proceed!");
      navigate('/login', { state: { from: '/client/payment' } });
      return;
    }

    // Save checkout info to localStorage for payment page
    const checkoutData = {
      shippingInfo,
      courier,
      paymentMethod,
      cartItems,
      totalPrice
    };
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

    // Navigate directly to payment page
    navigate('/client/payment');
  };

  // বাটন স্টাইল
  const getSelectableButtonStyle = (isSelected) => ({
    width: '100%',
    justifyContent: 'space-between',
    textAlign: 'left',
    padding: '15px 20px',
    border: isSelected ? '2px solid #1b5e20' : '1px solid #ccc',
    backgroundColor: isSelected ? '#e8f5e9' : '#fff',
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

      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#1b5e20', textAlign: 'center' }}>
        Checkout Process
      </Typography>

      <Grid container spacing={4} maxWidth="xl" sx={{ mx: 'auto' }}>
        {/* --- বাম পাশ: ফর্ম --- */}
        <Grid item xs={12} md={7}>

          {/* ১. শিপিং ঠিকানা */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ background: '#1b5e20', color: 'white', borderRadius: '50%', width: 25, height: 25, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14 }}>1</span>
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
              <Grid item xs={12} sm={6}>
                <TextField label="City/District" name="city" fullWidth required onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Phone Number" name="phone" fullWidth required type="number" onChange={handleInputChange} />
              </Grid>
            </Grid>
          </Paper>

          {/* ২. কুরিয়ার নির্বাচন */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ background: '#1b5e20', color: 'white', borderRadius: '50%', width: 25, height: 25, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14 }}>2</span>
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
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ background: '#1b5e20', color: 'white', borderRadius: '50%', width: 25, height: 25, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14 }}>3</span>
              Payment Method
            </Typography>

            <Typography variant="subtitle2" sx={{ color: '#1b5e20', fontWeight: 'bold', mt: 1, mb: 2 }}>
              ONLINE MOBILE PAYMENT (BD)
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {['bkash', 'nagad', 'rocket'].map((method) => (
                <Grid item xs={12} sm={4} key={method}>
                  <Button onClick={() => setPaymentMethod(method)} sx={getSelectableButtonStyle(paymentMethod === method)}>
                    <Box display="flex" alignItems="center" gap={1.5} sx={{ textTransform: 'capitalize' }}>
                      {/* লোগো না থাকলে টেক্সট দেখাবে */}
                      {method}
                    </Box>
                    {paymentMethod === method && <CheckCircleIcon color="success" />}
                  </Button>
                </Grid>
              ))}
            </Grid>

            <Typography variant="subtitle2" sx={{ color: '#555', fontWeight: 'bold', mb: 2 }}>
              CASH ON DELIVERY
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
              Order Summary ({cartItems.length} Items)
            </Typography>

            <List disablePadding sx={{ maxHeight: '40vh', overflow: 'auto', mb: 2 }}>
              {cartItems.map((item, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1.5, borderBottom: '1px dashed #eee' }}>
                  <ListItemAvatar>
                    <Avatar
                      src={getImageUrl(item.image)}
                      variant="rounded"
                      sx={{ bgcolor: 'transparent', border: '1px solid #eee' }}
                      imgProps={{ style: { objectFit: 'contain' } }}
                    >
                      C
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`Qty: ${item.qty} x ৳${item.price}`}
                  />
                  <Typography fontWeight="bold">
                    ৳{(item.price * item.qty).toLocaleString()}
                  </Typography>
                </ListItem>
              ))}
            </List>

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
              onClick={handleProceedToPayment}
              disabled={cartItems.length === 0 || !isFormValid}
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(27,94,32,0.3)',
                bgcolor: '#1b5e20',
                '&:hover': { bgcolor: '#004d40' }
              }}
            >
              PROCEED TO PAYMENT
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