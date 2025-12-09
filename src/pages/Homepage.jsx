import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

// API URL
const API_BASE_URL = "http://localhost:5000";

const HomePage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Load products from database and filter
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/products`);
                console.log("Fetched products:", data);
                
                // Filter only Mughal, Ancient, Sultan, and Janapada coins
                const featuredItems = data.filter(product => {
                    const cat = product.category ? product.category.toLowerCase() : "";
                    return cat.includes('mughal') || 
                           cat.includes('ancient') || 
                           cat.includes('sultan') || 
                           cat.includes('janapada');
                });

                // If filtered items exist, use them; otherwise, fallback to all data
                const finalDisplay = featuredItems.length > 0 ? featuredItems : data;
                setProducts(finalDisplay.slice(0, 8)); // Display first 8 products
                setLoading(false);
            } catch (error) {
                console.error("Error fetching homepage products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh', pb: 8 }}>
            
            {/* 🔥 Professional Hero Section with NEW COIN IMAGE */}
            <Box 
                sx={{
                    // Using professional coin image
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1590138436320-d9661b18470e?q=80&w=2070&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    height: { xs: '350px', md: '500px' }, // Increased height slightly
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: 'white',
                    mb: 5,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
            >
                <Container maxWidth="md">
                    <Typography 
                        variant="h3" 
                        fontWeight="bold" 
                        sx={{ 
                            fontFamily: 'serif', 
                            mb: 2, 
                            textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                            letterSpacing: '1px'
                        }}
                    >
                        Welcome to CoinHouseMarket
                    </Typography>
                    <Typography 
                        variant="h6" 
                        sx={{ mb: 1, color: '#e0e0e0', letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.9rem' }}
                    >
                        Made By Rakib
                    </Typography>
                    <Box sx={{ width: '60px', height: '3px', bgcolor: '#f9a825', mx: 'auto', my: 3 }}></Box>
                    <Typography 
                        variant="h5" 
                        sx={{ mt: 3, fontStyle: 'italic', color: '#ffecb3', fontWeight: 'light' }}
                    >
                        "Discover the Legacy of History – One Coin at a Time."
                    </Typography>
                </Container>
            </Box>

            {/* Featured Products Grid */}
            <Container maxWidth="lg">
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress color="success" />
                    </Box>
                ) : (
                    <Grid container spacing={4} justifyContent="center">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}> 
                                    <ProductCard product={product} />
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', width: '100%', py: 5 }}>
                                No historical coins found at the moment.
                            </Typography>
                        )}
                    </Grid>
                )}

                {/* Explore Button */}
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/all-products')}
                        sx={{
                            bgcolor: '#1b5e20',
                            '&:hover': { bgcolor: '#004d40' },
                            px: 5,
                            py: 1.5,
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            borderRadius: '30px',
                            boxShadow: '0 4px 15px rgba(27, 94, 32, 0.4)'
                        }}
                    >
                        View Full Collection &gt;
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default HomePage;