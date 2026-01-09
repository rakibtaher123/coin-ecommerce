import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Button, CircularProgress, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { Gavel, HistoryEdu, VerifiedUser, LocalShipping, EmojiEvents, ArrowForward } from '@mui/icons-material';

// API URL
const API_BASE_URL = "https://gangaridai-auction.onrender.com";

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
        <Box sx={{ backgroundColor: '#fff', minHeight: '100vh', pb: 0 }}>

            {/* 🔥 HERO SECTION */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: '500px', md: '700px' },
                    // NEW BACKGROUND: Dark Teal / Dark Sea Green Gradient
                    background: 'linear-gradient(135deg, #004D40 0%, #00251a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: 'white',
                    mb: 8,
                    overflow: 'hidden',
                    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)'
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>

                    {/* Animated Border/Frame Effect */}
                    <Box sx={{
                        border: '2px solid rgba(212, 175, 55, 0.5)', // Gold Border
                        p: { xs: 3, md: 8 },
                        backdropFilter: 'blur(3px)',
                        borderRadius: '4px',
                        background: 'rgba(0, 0, 0, 0.2)' // Slight dark overlay for contrast
                    }}>
                        <Typography
                            variant="h1"
                            component="h1"
                            sx={{
                                fontFamily: '"Playfair Display", serif',
                                fontWeight: 900, // EXTRA BOLD
                                mb: 2,
                                fontSize: { xs: '2.5rem', md: '5rem' },
                                letterSpacing: '2px',
                                textShadow: '4px 4px 10px rgba(0,0,0,0.8)', // Stronger Shadow
                                background: 'linear-gradient(45deg, #FFD700, #FDB931, #FFFFFF)',
                                backgroundClip: 'text',
                                textFillColor: 'transparent',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Gangaridai Numismatic Gallery
                        </Typography>


                        <Divider sx={{ width: '120px', height: '4px', bgcolor: '#d4af37', mx: 'auto', my: 4 }} />

                        <Typography
                            variant="h4" // Increased size
                            sx={{
                                mb: 6,
                                fontFamily: 'serif',
                                fontStyle: 'italic',
                                fontWeight: 'bold', // BOLD ITALIC specified by user
                                color: '#f5f5f5',
                                maxWidth: '900px',
                                mx: 'auto',
                                lineHeight: 1.6,
                                textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
                            }}
                        >
                            "Unearthing the legacy of Bengal and beyond. A premium sanctuary for collectors of history, heritage, and rare artifacts."
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/all-products')}
                                startIcon={<EmojiEvents />}
                                sx={{
                                    bgcolor: '#d4af37', // Gold
                                    color: '#000',
                                    px: 6,
                                    py: 1.8,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    borderRadius: '0',
                                    border: '2px solid #d4af37',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                                    '&:hover': {
                                        bgcolor: 'transparent',
                                        color: '#d4af37',
                                        border: '2px solid #d4af37'
                                    }
                                }}
                            >
                                Explorer Collection
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/auction/live')}
                                startIcon={<Gavel />}
                                sx={{
                                    color: '#fff',
                                    borderColor: '#fff',
                                    borderWidth: '2px',
                                    px: 6,
                                    py: 1.8,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    borderRadius: '0',
                                    '&:hover': {
                                        borderColor: '#d4af37',
                                        color: '#d4af37',
                                        bgcolor: 'rgba(0,0,0,0.5)',
                                        borderWidth: '2px'
                                    }
                                }}
                            >
                                Live Auctions
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* 🔥 WHY CHOOSE US (Trust Section) */}
            <Container maxWidth="lg" sx={{ mb: 10 }}>
                <Grid container spacing={4}>
                    {[
                        { icon: <HistoryEdu sx={{ fontSize: 50, color: '#1b5e20' }} />, title: 'Authentic History', desc: 'Every coin tells a story, verified by experts.' },
                        { icon: <VerifiedUser sx={{ fontSize: 50, color: '#1b5e20' }} />, title: 'Certified Genuine', desc: '100% genuine artifacts with provenance.' },
                        { icon: <LocalShipping sx={{ fontSize: 50, color: '#1b5e20' }} />, title: 'Secure Delivery', desc: 'Insured and tracked shipping worldwide.' },
                        { icon: <EmojiEvents sx={{ fontSize: 50, color: '#1b5e20' }} />, title: 'Premium Collection', desc: 'Rare finds from the Mughal & Sultanate eras.' },
                    ].map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Box sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                                <Box sx={{ mb: 2 }}>{item.icon}</Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, fontFamily: 'serif' }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.desc}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>



            {/* 🔥 FEATURED PRODUCTS */}
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontFamily: 'serif', fontWeight: 'bold', color: '#1E1E1E' }}>
                            Featured Artifacts
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                            Handpicked rarities for the discerning collector.
                        </Typography>
                    </Box>
                    <Button
                        endIcon={<ArrowForward />}
                        onClick={() => navigate('/all-products')}
                        sx={{ color: '#1b5e20', fontWeight: 'bold' }}
                    >
                        View All
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress color="success" />
                    </Box>
                ) : (
                    <Grid container spacing={4}>
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
            </Container>

            {/* 🔥 NEWSLETTER / CTA */}
            <Box sx={{ mt: 12, bgcolor: '#004D40', color: 'white', py: 8, textAlign: 'center' }}>
                <Container maxWidth="md">
                    <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 2 }}>
                        Start Your Collection Today
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#aaa', mb: 4 }}>
                        Join thousands of numismatists and secure your piece of history.
                        Sign up for exclusive auction alerts.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/register')}
                        sx={{
                            bgcolor: '#d4af37',
                            color: 'black',
                            fontWeight: 'bold',
                            px: 6,
                            '&:hover': { bgcolor: '#b49226' }
                        }}
                    >
                        Join GNG Now
                    </Button>
                </Container>
            </Box>

        </Box>
    );
};

export default HomePage;