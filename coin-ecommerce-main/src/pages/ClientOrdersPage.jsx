import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container, Paper, Typography, Button, Box, AppBar, Toolbar, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, Card, CardContent, Grid, Divider, CircularProgress, Tabs, Tab
} from '@mui/material';
import { ArrowBack, Visibility } from '@mui/icons-material';
// import { API_BASE_URL } from '../config';

const ClientOrdersPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    // Get status from URL query params
    const searchParams = new URLSearchParams(location.search);
    const statusFilter = searchParams.get('status');

    useEffect(() => {
        // Set active tab based on status filter
        if (statusFilter === 'pending') setActiveTab(1);
        else if (statusFilter === 'completed') setActiveTab(2);
        else setActiveTab(0);

        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`https://gangaridai-auction.onrender.com/api/orders/myorders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        if (newValue === 0) navigate('/client/orders');
        else if (newValue === 1) navigate('/client/orders?status=pending');
        else if (newValue === 2) navigate('/client/orders?status=completed');
    };

    const filteredOrders = orders.filter(order => {
        if (activeTab === 1) return order.status === 'Pending' || order.status === 'Processing';
        if (activeTab === 2) return order.status === 'Delivered';
        return true; // Show all for tab 0
    });

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://gangaridai-auction.onrender.com/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("Order deleted successfully!");
                // Remove order from local state
                setOrders(orders.filter(order => order._id !== orderId));
            } else {
                const data = await response.json();
                alert(data.message || "Failed to delete order");
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("Error deleting order");
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', py: 4 }}>
            {/* Header */}
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                    <IconButton onClick={() => navigate('/client')} sx={{ bgcolor: 'white' }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" fontWeight="bold" color="#1b5e20">
                        My Orders
                    </Typography>
                </Box>

                {/* Tabs */}
                <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3, bgcolor: 'white', borderRadius: 2, p: 1 }}>
                    <Tab label={`All Orders (${orders.length})`} />
                    <Tab label={`Pending (${orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length})`} />
                    <Tab label={`Completed (${orders.filter(o => o.status === 'Delivered').length})`} />
                </Tabs>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={60} color="success" />
                    </Box>
                ) : filteredOrders.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No orders found
                        </Typography>
                        <Button variant="contained" onClick={() => navigate('/client/products')} sx={{ mt: 2 }}>
                            Start Shopping
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {filteredOrders.map((order) => (
                            <Grid item xs={12} key={order._id}>
                                <Card>
                                    <CardContent>
                                        {/* Order Header */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6" gutterBottom>
                                                    Order #{order._id.slice(-8)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <Chip
                                                    label={order.isPaid ? 'Paid' : 'Unpaid'}
                                                    color={order.isPaid ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                                <Chip
                                                    label={order.status}
                                                    color={getStatusColor(order.status)}
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        {/* Order Items */}
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            Items:
                                        </Typography>
                                        {order.orderItems?.map((item, index) => (
                                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                                                <Typography variant="body2">
                                                    {item.name} (x{item.qty})
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
                                                Total: ৳{order.totalPrice.toLocaleString()}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {!order.isPaid && (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            color="success"
                                                            onClick={() => {
                                                                localStorage.setItem('checkoutData', JSON.stringify({
                                                                    cartItems: order.orderItems,
                                                                    totalPrice: order.totalPrice,
                                                                    shippingInfo: order.shippingAddress
                                                                }));
                                                                navigate('/client/payment');
                                                            }}
                                                        >
                                                            Pay Now
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleDeleteOrder(order._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<Visibility />}
                                                    size="small"
                                                    onClick={() => navigate(`/client/orders/${order._id}`)}
                                                >
                                                    View Details
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


