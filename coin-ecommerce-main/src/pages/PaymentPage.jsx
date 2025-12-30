import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Container, Grid, Paper, Typography, Button, TextField,
    Radio, RadioGroup, FormControlLabel, FormControl, Divider,
    CircularProgress, Alert, IconButton, Collapse
} from '@mui/material';
import {
    CreditCard as CreditCardIcon,
    PhoneAndroid as MobileIcon,
    LocalShipping as CodIcon,
    Lock as LockIcon
} from '@mui/icons-material';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [checkoutData, setCheckoutData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'mobile', 'cod'
    const [mobileProvider, setMobileProvider] = useState('bkash');

    // Card State
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: ''
    });

    useEffect(() => {
        // 1. Try to get data from location state (Direct Buy/Auction)
        if (location.state?.totalPrice || location.state?.amount) {
            setCheckoutData({
                cartItems: location.state.cartItems || [{
                    name: location.state.productName || 'Item',
                    price: location.state.amount || 0,
                    qty: 1,
                    image: location.state.image
                }],
                totalPrice: location.state.totalPrice || location.state.amount,
                shippingInfo: location.state.shippingInfo || { address: 'Not Provided' }
            });
            return;
        }

        // 2. Fallback to localStorage (Regular Checkout)
        const savedData = localStorage.getItem('checkoutData');
        if (savedData) {
            setCheckoutData(JSON.parse(savedData));
        } else {
            // No data found -> Redirect
            navigate('/cart');
        }
    }, [navigate, location]);

    const handleCardChange = (e) => {
        setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
    };

    const handlePayNow = async () => {
        setLoading(true);
        setError('');

        // Basic Validation
        if (paymentMethod === 'card') {
            if (!cardDetails.number || !cardDetails.cvc || !cardDetails.expiry) {
                setError("Please fill in all card details.");
                setLoading(false);
                return;
            }
        }

        // Simulate API Processing or Redirect to Gateway
        setTimeout(() => {
            // Success
            navigate('/payment-success'); // Mock success
            // In real app: call API endpoint
        }, 2000);
    };

    if (!checkoutData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 6, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>

                    {/* Left Column: Payment Methods */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LockIcon color="primary" fontSize="small" /> Select Payment Method
                            </Typography>

                            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                            {/* Payment Options */}
                            <FormControl component="fieldset" fullWidth>
                                <RadioGroup
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    {/* 1. Credit Card */}
                                    <Box sx={{
                                        border: paymentMethod === 'card' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                        borderRadius: 2, p: 2, mb: 2, cursor: 'pointer',
                                        bgcolor: paymentMethod === 'card' ? '#e3f2fd' : 'transparent',
                                        transition: 'all 0.3s ease'
                                    }}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <FormControlLabel
                                            value="card"
                                            control={<Radio />}
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CreditCardIcon sx={{ color: '#1565c0' }} />
                                                    <Typography fontWeight="bold">Credit / Debit Card</Typography>
                                                </Box>
                                            }
                                        />

                                        <Collapse in={paymentMethod === 'card'}>
                                            <Divider sx={{ my: 2 }} />
                                            <Grid container spacing={2} sx={{ pl: 4 }}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        label="Card Number"
                                                        name="number"
                                                        fullWidth
                                                        variant="outlined"
                                                        placeholder="0000 0000 0000 0000"
                                                        size="small"
                                                        value={cardDetails.number}
                                                        onChange={handleCardChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        label="Cardholder Name"
                                                        name="name"
                                                        fullWidth
                                                        variant="outlined"
                                                        placeholder="JHON DOE"
                                                        size="small"
                                                        value={cardDetails.name}
                                                        onChange={handleCardChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Expiry Date"
                                                        name="expiry"
                                                        fullWidth
                                                        variant="outlined"
                                                        placeholder="MM/YY"
                                                        size="small"
                                                        value={cardDetails.expiry}
                                                        onChange={handleCardChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="CVC / CWW"
                                                        name="cvc"
                                                        fullWidth
                                                        variant="outlined"
                                                        placeholder="123"
                                                        size="small"
                                                        value={cardDetails.cvc}
                                                        onChange={handleCardChange}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Collapse>
                                    </Box>

                                    {/* 2. Mobile Banking */}
                                    <Box sx={{
                                        border: paymentMethod === 'mobile' ? '2px solid #ed6c02' : '1px solid #e0e0e0',
                                        borderRadius: 2, p: 2, mb: 2, cursor: 'pointer',
                                        bgcolor: paymentMethod === 'mobile' ? '#fff3e0' : 'transparent',
                                        transition: 'all 0.3s ease'
                                    }}
                                        onClick={() => setPaymentMethod('mobile')}
                                    >
                                        <FormControlLabel
                                            value="mobile"
                                            control={<Radio />}
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <MobileIcon sx={{ color: '#e65100' }} />
                                                    <Typography fontWeight="bold">Mobile Banking</Typography>
                                                </Box>
                                            }
                                        />
                                        <Collapse in={paymentMethod === 'mobile'}>
                                            <Divider sx={{ my: 2 }} />
                                            <Box sx={{ pl: 4, display: 'flex', gap: 2 }}>
                                                {['bkash', 'nagad', 'rocket'].map((provider) => (
                                                    <Box
                                                        key={provider}
                                                        onClick={(e) => { e.stopPropagation(); setMobileProvider(provider); }}
                                                        sx={{
                                                            border: mobileProvider === provider ? '2px solid #e65100' : '1px solid #ddd',
                                                            p: 1.5, borderRadius: 2, cursor: 'pointer',
                                                            bgcolor: 'white', minWidth: 80, textAlign: 'center'
                                                        }}
                                                    >
                                                        <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{provider}</Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Collapse>
                                    </Box>

                                    {/* 3. Cash on Delivery */}
                                    <Box sx={{
                                        border: paymentMethod === 'cod' ? '2px solid #2e7d32' : '1px solid #e0e0e0',
                                        borderRadius: 2, p: 2, cursor: 'pointer',
                                        bgcolor: paymentMethod === 'cod' ? '#e8f5e9' : 'transparent',
                                        transition: 'all 0.3s ease'
                                    }}
                                        onClick={() => setPaymentMethod('cod')}
                                    >
                                        <FormControlLabel
                                            value="cod"
                                            control={<Radio />}
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CodIcon sx={{ color: '#1b5e20' }} />
                                                    <Typography fontWeight="bold">Cash on Delivery</Typography>
                                                </Box>
                                            }
                                        />
                                        <Collapse in={paymentMethod === 'cod'}>
                                            <Typography variant="body2" color="text.secondary" sx={{ pl: 4, mt: 1 }}>
                                                Pay comfortably with cash when your product is delivered.
                                            </Typography>
                                        </Collapse>
                                    </Box>

                                </RadioGroup>
                            </FormControl>
                        </Paper>
                    </Grid>

                    {/* Right Column: Order Summary */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{
                            p: 3, borderRadius: 3,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            position: 'sticky', top: 20
                        }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Order Summary
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
                                {checkoutData.cartItems?.map((item, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.name} <span style={{ fontSize: '0.8em' }}>x{item.qty}</span>
                                        </Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            ৳{(item.price * item.qty).toLocaleString()}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography color="text.secondary">Subtotal</Typography>
                                <Typography fontWeight="bold">৳{checkoutData.totalPrice.toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography color="text.secondary">Shipping</Typography>
                                <Typography fontWeight="bold" color="success.main">Free</Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex', justifyContent: 'space-between', mt: 3,
                                p: 2, bgcolor: '#f0f4c3', borderRadius: 2
                            }}>
                                <Typography variant="h6" fontWeight="bold" color="text.primary">Total</Typography>
                                <Typography variant="h5" fontWeight="bold" color="primary.main">
                                    ৳{checkoutData.totalPrice.toLocaleString()}
                                </Typography>
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handlePayNow}
                                disabled={loading}
                                sx={{
                                    mt: 3, py: 1.8, fontSize: '1rem',
                                    fontWeight: 'bold',
                                    bgcolor: '#1b5e20',
                                    '&:hover': { bgcolor: '#004d40' },
                                    boxShadow: '0 8px 16px rgba(27,94,32,0.2)'
                                }}
                            >
                                {loading ? <CircularProgress size={26} color="inherit" /> : `PAY ৳${checkoutData.totalPrice.toLocaleString()}`}
                            </Button>

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Trusted 100% Secure Payment
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
};

export default PaymentPage;
