import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Container, Paper, Typography, Button, Grid, Divider,
    List, ListItem, ListItemText, CircularProgress, Alert
} from '@mui/material';
import { Payment, CheckCircle, LocalShipping } from '@mui/icons-material';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [checkoutData, setCheckoutData] = useState(null);
    const [isAuctionBid, setIsAuctionBid] = useState(false);

    useEffect(() => {
        // Check if payment is from auction bid (location.state)
        if (location.state?.amount && location.state?.productName) {
            setIsAuctionBid(true);
            setCheckoutData({
                totalPrice: location.state.amount,
                cartItems: [{
                    name: location.state.productName,
                    price: location.state.amount,
                    qty: 1
                }],
                shippingInfo: {
                    firstName: 'Demo',
                    lastName: 'User',
                    address: 'N/A (Auction Bid)',
                    city: 'Dhaka',
                    phone: '01711223344'
                },
                courier: 'N/A',
                paymentMethod: 'SSLCommerz'
            });
            return;
        }

        // Otherwise, get saved checkout data from localStorage
        const savedData = localStorage.getItem('checkoutData');
        if (!savedData) {
            navigate('/checkout');
            return;
        }
        setCheckoutData(JSON.parse(savedData));
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
                    email: userPayload.email || 'customer@example.com',
                    phone: checkoutData.shippingInfo.phone,
                    address: checkoutData.shippingInfo.address,
                    city: checkoutData.shippingInfo.city || 'Dhaka'
                }
            };

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
            setError('Failed to connect to payment gateway');
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
        <Box sx={{ py: 6, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Container maxWidth="md">
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#1b5e20', textAlign: 'center' }}>
                    Confirm Payment
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Order Summary */}
                <Paper sx={{ p: 4, mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: '#1b5e20' }} />
                        Order Summary
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <List>
                        {checkoutData.cartItems.map((item, index) => (
                            <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemText
                                    primary={item.name}
                                    secondary={`Qty: ${item.qty} x ৳${item.price.toLocaleString()}`}
                                />
                                <Typography fontWeight="bold">
                                    ৳{(item.qty * item.price).toLocaleString()}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Subtotal:</Typography>
                        <Typography fontWeight="bold">৳{checkoutData.totalPrice.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography>Shipping:</Typography>
                        <Typography fontWeight="bold" color="success.main">Free</Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight="bold">Total Amount:</Typography>
                        <Typography variant="h5" fontWeight="bold" color="primary">
                            ৳{checkoutData.totalPrice.toLocaleString()}
                        </Typography>
                    </Box>
                </Paper>

                {/* Shipping Info */}
                <Paper sx={{ p: 4, mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalShipping sx={{ color: '#1b5e20' }} />
                        Shipping Details
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography color="text.secondary">Name:</Typography>
                            <Typography fontWeight="bold">
                                {checkoutData.shippingInfo.firstName} {checkoutData.shippingInfo.lastName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography color="text.secondary">Address:</Typography>
                            <Typography fontWeight="bold">{checkoutData.shippingInfo.address}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography color="text.secondary">City:</Typography>
                            <Typography fontWeight="bold">{checkoutData.shippingInfo.city}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography color="text.secondary">Phone:</Typography>
                            <Typography fontWeight="bold">{checkoutData.shippingInfo.phone}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography color="text.secondary">Courier:</Typography>
                            <Typography fontWeight="bold">{checkoutData.courier}</Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Payment Method */}
                <Paper sx={{ p: 4, mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Payment sx={{ color: '#1b5e20' }} />
                        Payment Method
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                        {checkoutData.paymentMethod}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        You will be redirected to SSLCommerz payment gateway
                    </Typography>
                </Paper>

                {/* Action Buttons */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="outlined"
                            fullWidth
                            size="large"
                            onClick={() => navigate('/checkout')}
                            disabled={loading}
                            sx={{ py: 1.5 }}
                        >
                            Back to Checkout
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handlePayment}
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                bgcolor: '#1b5e20',
                                '&:hover': { bgcolor: '#004d40' }
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

export default PaymentPage;
