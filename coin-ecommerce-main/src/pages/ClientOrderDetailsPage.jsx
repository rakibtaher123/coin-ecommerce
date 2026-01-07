import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Paper, Grid, Divider, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, CircularProgress, AppBar, Toolbar, IconButton
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const ClientOrderDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrder(data);
                } else {
                    alert('Failed to fetch order details');
                    navigate('/client/orders');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                navigate('/client/orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id, navigate]);

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress color="success" />
            </Box>
        );
    }

    if (!order) return null;

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'success';
            case 'processing': return 'warning';
            case 'shipped': return 'info';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            {/* Header */}
            <AppBar position="sticky" sx={{ bgcolor: '#1b5e20' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => navigate('/client/orders')}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                        Order Details #{order._id.slice(-8)}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={3}>
                    {/* Left Column: Order Info & Items */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Order Items
                                </Typography>
                                <Chip
                                    label={order.status}
                                    color={getStatusColor(order.status)}
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell align="center">Quantity</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {order.orderItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <img
                                                            src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                                                            alt={item.name}
                                                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, marginRight: 16 }}
                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/50' }}
                                                        />
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {item.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">{item.qty}</TableCell>
                                                <TableCell align="right">৳{item.price.toLocaleString()}</TableCell>
                                                <TableCell align="right">৳{(item.price * item.qty).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                    {/* Right Column: Summary & Shipping */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Order Summary
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography color="text.secondary">Items Price</Typography>
                                <Typography>৳{order.itemsPrice?.toLocaleString() || 0}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography color="text.secondary">Shipping</Typography>
                                <Typography>৳{order.shippingPrice?.toLocaleString() || 0}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography color="text.secondary">Tax</Typography>
                                <Typography>৳{order.taxPrice?.toLocaleString() || 0}</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">Total</Typography>
                                <Typography variant="h6" color="primary" fontWeight="bold">
                                    ৳{order.totalPrice.toLocaleString()}
                                </Typography>
                            </Box>

                            {!order.isPaid && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    size="large"
                                    onClick={() => {
                                        localStorage.setItem('checkoutData', JSON.stringify({
                                            cartItems: order.orderItems,
                                            totalPrice: order.totalPrice,
                                            shippingInfo: order.shippingAddress
                                        }));
                                        navigate('/client/payment');
                                    }}
                                >
                                    Proceed to Pay
                                </Button>
                            )}

                            {order.isPaid && (
                                <Box sx={{ bgcolor: '#e8f5e9', p: 2, borderRadius: 1, textAlign: 'center' }}>
                                    <Typography color="success.main" fontWeight="bold">
                                        ✅ Paid on {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'N/A'}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Shipping Info
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Typography variant="subtitle2" gutterBottom>Address:</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
                            </Typography>

                            <Typography variant="subtitle2" gutterBottom>Payment Method:</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                {order.paymentMethod}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ClientOrderDetailsPage;
