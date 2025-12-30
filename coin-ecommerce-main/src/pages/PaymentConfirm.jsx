import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Container, Paper, Typography, Button, Grid, Divider,
    List, ListItem, ListItemText, CircularProgress, Alert
} from '@mui/material';
import { CheckCircle, LocalShipping, Payment } from '@mui/icons-material';

const PaymentConfirm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [checkoutData, setCheckoutData] = useState(null);

    useEffect(() => {
        // 1. Try to get data from location state (Direct Buy/Auction)
        // If coming from auction/bidding, formatting might be needed to match cart structure
        if (location.state?.totalPrice || location.state?.amount) {
            setCheckoutData({
                cartItems: location.state.cartItems || [{
                    name: location.state.productName || 'Auction Item',
                    price: location.state.amount || 0,
                    qty: 1,
                    image: location.state.image
                }],
                totalPrice: location.state.totalPrice || location.state.amount,
                shippingInfo: location.state.shippingInfo || {
                    firstName: "User",
                    lastName: "",
                    address: "N/A",
                    city: "N/A",
                    phone: "N/A"
                },
                courier: location.state.courier || "N/A",
                paymentMethod: location.state.paymentMethod || "N/A"
            });
            return;
        }

        // 2. Fallback to localStorage (Regular Checkout)
        const savedData = localStorage.getItem('checkoutData');
        if (savedData) {
            setCheckoutData(JSON.parse(savedData));
        } else {
            // No data found -> Redirect to cart or checkout
            // navigate('/cart');
            // For safety, let's just show a loading state or empty if really nothing, 
            // but user asked to redirect.
            navigate('/client/checkout');
        }
    }, [navigate, location]);

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const userPayload = token ? JSON.parse(atob(token.split('.')[1])) : {};

            const paymentData = {
                amount: checkoutData.totalPrice,
                orderInfo: {
                    productName: checkoutData.cartItems.map(item => item.name).join(', '),
                    items: checkoutData.cartItems.length
                },
                customerInfo: {
                    name: checkoutData.shippingInfo.firstName + ' ' + (checkoutData.shippingInfo.lastName || ''),
                    email: userPayload.email || localStorage.getItem('userEmail') || 'customer@example.com',
                    phone: checkoutData.shippingInfo.phone,
                    address: checkoutData.shippingInfo.address,
                    city: checkoutData.shippingInfo.city || 'Dhaka'
                }
            };

            // API Call
            const response = await fetch('http://localhost:5000/api/payment/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();

            if (data.success && data.gatewayUrl) {
                // Redirect to SSLCommerz payment gateway
                window.location.href = data.gatewayUrl;
            } else {
                setError(data.message || 'Payment initiation failed');
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError('Failed to connect to payment gateway. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!checkoutData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 6, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <Container maxWidth="md">
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, color: '#1b5e20', textAlign: 'center' }}>
                    Confirm Payment
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Card 1: Order Summary */}
                <Paper sx={{ p: 4, mb: 3, borderTop: '4px solid #1b5e20', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem' }}>
                        <CheckCircle sx={{ color: '#1b5e20', fontSize: 20 }} />
                        Order Summary
                    </Typography>
                    <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                    <List disablePadding>
                        {checkoutData.cartItems.map((item, index) => (
                            <ListItem key={index} sx={{ px: 0, py: 1 }}>
                                <ListItemText
                                    primary={item.name}
                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                    secondary={`Qty: ${item.qty} x ৳${item.price.toLocaleString()}`}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                />
                                <Typography variant="body2" fontWeight="bold">
                                    ৳{(item.qty * item.price).toLocaleString()}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                        <Typography variant="body2" fontWeight="bold">৳{checkoutData.totalPrice.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Shipping:</Typography>
                        <Typography variant="body2" fontWeight="bold" color="success.main">Free</Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>Total Amount:</Typography>
                        <Typography variant="h5" fontWeight="bold" color="primary.main">
                            ৳{checkoutData.totalPrice.toLocaleString()}
                        </Typography>
                    </Box>
                </Paper>

                {/* Card 2: Shipping Details */}
                <Paper sx={{ p: 4, mb: 3, borderLeft: '4px solid #1b5e20', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem' }}>
                        <LocalShipping sx={{ color: '#1b5e20', fontSize: 20 }} />
                        Shipping Details
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary" display="block">Name:</Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {checkoutData.shippingInfo.firstName} {checkoutData.shippingInfo.lastName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary" display="block">Address:</Typography>
                            <Typography variant="body2" fontWeight="bold">{checkoutData.shippingInfo.address}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" display="block">City:</Typography>
                            <Typography variant="body2" fontWeight="bold">{checkoutData.shippingInfo.city}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" display="block">Phone:</Typography>
                            <Typography variant="body2" fontWeight="bold">{checkoutData.shippingInfo.phone}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary" display="block">Courier:</Typography>
                            <Typography variant="body2" fontWeight="bold">{checkoutData.courier}</Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Card 3: Payment Method */}
                <Paper sx={{ p: 4, mb: 3, borderLeft: '4px solid #1b5e20', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem' }}>
                        <Payment sx={{ color: '#1b5e20', fontSize: 20 }} />
                        Payment Method
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography fontWeight="bold" sx={{ textTransform: 'uppercase', fontSize: '1rem' }}>
                        {checkoutData.paymentMethod}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        You will be redirected to SSLCommerz payment gateway securely.
                    </Typography>
                </Paper>

                {/* Buttons */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate('/client/checkout')}
                            disabled={loading}
                            sx={{ py: 1.5, textTransform: 'uppercase', fontWeight: 'bold' }}
                        >
                            Back to Checkout
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handlePayment}
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                bgcolor: '#1b5e20',
                                '&:hover': { bgcolor: '#004d40' },
                                textTransform: 'uppercase',
                                fontWeight: 'bold'
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Proceed to Payment'}
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default PaymentConfirm;
