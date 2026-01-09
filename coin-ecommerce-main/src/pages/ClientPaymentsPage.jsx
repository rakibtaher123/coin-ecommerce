import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, Typography, Button, Box, AppBar, Toolbar, IconButton,
    Card, CardContent, Grid, Chip, Alert
} from '@mui/material';
import { ArrowBack, CreditCard, AccountBalance, Star } from '@mui/icons-material';

const ClientPaymentsPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://gangaridai-auction.onrender.com/api/orders/myorders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Processing': return 'info';
            case 'Shipped': return 'primary';
            case 'Delivered': return 'success';
            case 'Cancelled': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* Header */}
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => navigate('/client')}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                        Payment History & Methods
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ py: 4 }} maxWidth="md">

                {/* Available Methods Info */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Accepted Payment Methods
                    </Typography>
                    <Grid container spacing={2}>
                        {['bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard'].map((method) => (
                            <Grid item xs={6} sm={4} md={2} key={method}>
                                <Chip label={method} color="primary" variant="outlined" sx={{ width: '100%' }} />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {/* Payment/Order History */}
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Payment History (Your Orders)
                </Typography>

                {loading ? (
                    <Typography>Loading payments...</Typography>
                ) : orders.length === 0 ? (
                    <Alert severity="info">No payment history found.</Alert>
                ) : (
                    <Grid container spacing={2}>
                        {orders.map((order) => (
                            <Grid item xs={12} key={order._id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    Order #{order._id.slice(-6).toUpperCase()}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" color="success.main" fontWeight="bold">
                                                    ৳{order.totalPrice?.toLocaleString()}
                                                </Typography>
                                                <Typography variant="caption" display="block">
                                                    {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'CASH'}
                                                </Typography>
                                            </Box>
                                            <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default ClientPaymentsPage;

