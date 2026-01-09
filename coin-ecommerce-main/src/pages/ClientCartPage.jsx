import React from 'react';
import {
    Box, Container, Typography, Button, Paper, IconButton, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Divider, Grid, TextField,
    AppBar, Toolbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';

const ClientCartPage = () => {
    const navigate = useNavigate();
    const { cartItems = [], totalPrice = 0, removeFromCart } = useCart();

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/150';
        return imagePath.startsWith('http')
            ? imagePath
            : `https://gangaridai-auction.onrender.com${imagePath}`;
    };

    const handleCheckoutClick = () => {
        navigate('/client/checkout');
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
                {/* Header */}
                <AppBar position="sticky" sx={{ bgcolor: '#1b5e20' }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => navigate('/client/products')}>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                            Shopping Cart
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box sx={{ py: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" sx={{ mb: 2 }}>🛒</Typography>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#555' }}>
                            Your Cart is Empty
                        </Typography>
                        <Button onClick={() => navigate('/client/products')} variant="contained" size="large" sx={{ mt: 3, bgcolor: '#1b5e20' }}>
                            Browse Products
                        </Button>
                    </Container>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            {/* Header */}
            <AppBar position="sticky" sx={{ bgcolor: '#1b5e20' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => navigate('/client/products')}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                        Shopping Cart ({cartItems.length} items)
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                            <Table>
                                <TableHead sx={{ bgcolor: '#e8f5e9' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Product Details</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Price</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cartItems.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell>
                                                <Box display="flex" alignItems="center">
                                                    <img
                                                        src={getImageUrl(item.image)}
                                                        alt={item.name}
                                                        style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: '8px', marginRight: '15px', border: '1px solid #eee', backgroundColor: 'white' }}
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=No+Image'; }}
                                                    />
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="bold">{item.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">Cat: {item.category}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">৳{item.price}</TableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.qty}
                                                    inputProps={{ min: 1, style: { textAlign: 'center' }, readOnly: true }}
                                                    sx={{ width: 60 }}
                                                />
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                                                ৳{(item.price * item.qty).toLocaleString()}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton color="error" onClick={() => removeFromCart(item._id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 100 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee', pb: 2 }}>
                                Order Summary
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 2 }}>
                                <Typography color="text.secondary">Subtotal</Typography>
                                <Typography fontWeight="bold">৳{totalPrice.toLocaleString()}</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight="bold">Total</Typography>
                                <Typography variant="h5" fontWeight="bold" color="#1b5e20">
                                    ৳{totalPrice.toLocaleString()}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={handleCheckoutClick}
                                sx={{ bgcolor: '#1b5e20', py: 1.5, '&:hover': { bgcolor: '#004d40' } }}
                            >
                                PROCEED TO CHECKOUT
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ClientCartPage;

