import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Card, CardMedia, CardContent, Typography, Button,
    Box, Chip, AppBar, Toolbar, IconButton, CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, ShoppingCart, LocalOffer, Category, Description } from '@mui/icons-material';
import { useCart } from '../context/CartProvider';
// import { API_BASE_URL } from '../config';

const getFullImageUrl = (imagePath) => {
    if (imagePath && !imagePath.startsWith('http')) {
        const pathWithSlash = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `http://localhost:5000${pathWithSlash}`;
    }
    return imagePath;
};

const ClientProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setError("Product ID is missing.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`http://localhost:5000/api/products/${id}`);

                if (response.status === 404) {
                    throw new Error("Product not found in the database.");
                }
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                setProduct(data);

            } catch (err) {
                console.error("❌ Single Product Fetch error:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!product || error) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
                <Container sx={{ py: 8, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">
                        {error || "Product not found"}
                    </Typography>
                    <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/client/products')}>Go Back to Products</Button>
                </Container>
            </Box>
        );
    }

    const handleAddToCart = () => {
        if (product.countInStock && qty > product.countInStock) {
            alert(`Sorry! Only ${product.countInStock} items in stock.`);
            return;
        }

        addToCart(product, qty);
        navigate('/client/cart'); // ✅ Navigate to Client Cart
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            {/* Header */}
            <AppBar position="sticky" sx={{ bgcolor: '#1b5e20' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => navigate('/client/products')}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                        Product Details
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardMedia
                                component="img"
                                image={getFullImageUrl(product.image)}
                                alt={product.name}
                                sx={{ objectFit: 'contain', width: '100%', maxHeight: 540, bgcolor: '#fff' }}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
                            />
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>{product.name}</Typography>

                        {product.year && (
                            <Typography variant="subtitle1" sx={{ mt: 1, color: 'text.secondary' }}>Published: {product.year}</Typography>
                        )}

                        {product.description && (
                            <Typography variant="body1" sx={{ mt: 2 }}>{product.description}</Typography>
                        )}

                        <Typography variant="h5" sx={{ mt: 3, fontWeight: 'bold' }}>Price: ৳{product.price}</Typography>

                        <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold', color: product.countInStock > 0 ? 'black' : 'red' }}>
                            Availability: {product.countInStock > 0 ? `In Stock (${product.countInStock || 0} items)` : 'Out of Stock'}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 4 }}>
                            <TextField
                                label="Quantity"
                                type="number"
                                value={qty}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val > 0 && val <= (product.countInStock || Infinity)) {
                                        setQty(val);
                                    }
                                }}
                                inputProps={{ min: 1, max: product.countInStock || 1 }}
                                sx={{ width: 120 }}
                                disabled={product.countInStock === 0}
                            />

                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleAddToCart}
                                sx={{ py: 1.5 }}
                                disabled={product.countInStock === 0}
                            >
                                Add to Cart
                            </Button>

                            <Button variant="outlined" onClick={() => navigate('/client/products')}>
                                Browse More
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ClientProductDetailsPage;
