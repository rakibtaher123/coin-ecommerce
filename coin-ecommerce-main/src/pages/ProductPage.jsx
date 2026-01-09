import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Card, CardMedia, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
// import coinData from '../dataWithMeta'; // ❌ স্ট্যাটিক ডাটা সোর্স বাদ দেওয়া হলো
import { useCart } from '../context/CartProvider';
// import { useProducts } from '../context/ProductContext'; // পুরো লিস্ট লোডের দরকার নেই

// API Base URL (ProductContext এর সাথে সামঞ্জস্যপূর্ণ)
const API_BASE_URL = "https://gangaridai-auction.onrender.com";

// ✅ ইমেজ URL ফিক্স ফাংশন
const getFullImageUrl = (imagePath) => {
    if (imagePath && !imagePath.startsWith('http')) {
        // Ensure leading slash if missing
        const pathWithSlash = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${API_BASE_URL}${pathWithSlash}`;
    }
    return imagePath;
};

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const cart = useCart();

    // ✅ নতুন স্টেট: সরাসরি এই কম্পোনেন্টে ডাটা লোড হবে
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qty, setQty] = useState(1);

    // --- ডাটা ফেচ করার লজিক (useEffect) ---
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

                // ✅ সরাসরি API endpoint থেকে একটি প্রোডাক্ট লোড করা হচ্ছে
                const response = await fetch(`${API_BASE_URL}/api/products/${id}`);

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

    // --- Loading State ---
    if (loading) {
        return (
            <Container sx={{ py: 10, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    // --- Product Not Found State ---
    if (!product || error) {
        return (
            <Container sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" color="error">
                    {error || "Product not found"}
                </Typography>
                <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate(-1)}>Go Back</Button>
            </Container>
        );
    }

    // Product data is available here
    const handleAddToCart = () => {
        if (product.countInStock && qty > product.countInStock) {
            alert(`দুঃখিত! স্টকে আছে মাত্র ${product.countInStock} টি।`);
            return;
        }

        // Add to Cart এ সঠিক প্রোডাক্ট অবজেক্ট ও কোয়ান্টিটি পাঠানো
        cart.addToCart(product, qty);
        navigate('/cart');
    };

    return (
        <Box sx={{ py: 6, backgroundColor: '#f6fbf6', minHeight: '80vh' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardMedia
                                component="img"
                                // ✅ ফিক্স: ইমেজ URL ঠিক করা হলো
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
                                // ইনপুট লজিক: 1 থেকে স্টকের মধ্যে সংখ্যা নিশ্চিত করা
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

                            <Button variant="outlined" onClick={() => navigate('/all-products')}>
                                View Collection
                            </Button>
                        </Box>

                        <Box sx={{ mt: 4 }}>
                            <Button onClick={() => navigate(-1)}>&larr; Back</Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ProductPage;
