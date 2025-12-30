import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, Typography, Button, Box, AppBar, Toolbar, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, Card, CardContent, Grid, Divider
} from '@mui/material';
import { ArrowBack, Visibility } from '@mui/icons-material';

const ClientOrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        // TODO: Implement real API call to fetch user's orders
        // For now, using sample data
        setTimeout(() => {
            setOrders([
                {
                    _id: '1',
                    orderNumber: 'ORD-2024-001',
                    date: '2024-12-10',
                    status: 'Delivered',
                    total: 25000,
                    items: [
                        { name: 'Akbar Silver Rupee', price: 15000, quantity: 1 },
                        { name: 'Mughal Gold Mohur', price: 10000, quantity: 1 }
                    ]
                },
                {
                    _id: '2',
                    orderNumber: 'ORD-2024-002',
                    date: '2024-12-12',
                    status: 'Processing',
                    total: 5000,
                    items: [
                        { name: '1 Taka Coin (1973)', price: 5000, quantity: 1 }
                    ]
                },
                {
                    _id: '3',
                    orderNumber: 'ORD-2024-003',
                    date: '2024-12-13',
                    status: 'Pending',
                    total: 18000,
                    items: [
                        { name: 'British Indian Rupee', price: 18000, quantity: 1 }
                    ]
                }
            ]);
            setLoading(false);
        }, 500);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'success';
            case 'processing': return 'warning';
            case 'pending': return 'info';
            case 'cancelled': return 'error';
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
                        My Orders
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ py: 4 }}>
                {loading ? (
                    <Typography>Loading orders...</Typography>
                ) : orders.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No orders yet
                        </Typography>
                        <Button variant="contained" onClick={() => navigate('/client/products')} sx={{ mt: 2 }}>
                            Start Shopping
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {orders.map((order) => (
                            <Grid item xs={12} key={order._id}>
                                <Card>
                                    <CardContent>
                                        {/* Order Header */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6" gutterBottom>
                                                    Order #{order.orderNumber}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Date: {new Date(order.date).toLocaleDateString('en-GB')}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={order.status}
                                                color={getStatusColor(order.status)}
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        {/* Order Items */}
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            Items:
                                        </Typography>
                                        {order.items.map((item, index) => (
                                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                                                <Typography variant="body2">
                                                    {item.name} (x{item.quantity})
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    ৳{item.price.toLocaleString()}
                                                </Typography>
                                            </Box>
                                        ))}

                                        <Divider sx={{ my: 2 }} />

                                        {/* Total & Actions */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6" color="primary">
                                                Total: ৳{order.total.toLocaleString()}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<Visibility />}
                                                    size="small"
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => navigate('/track-order')}
                                                >
                                                    Track Order
                                                </Button>
                                            </Box>
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

export default ClientOrdersPage;
