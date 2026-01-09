import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Paper, Button, Chip, CircularProgress,
    Card, CardContent, CardMedia, CardActions, Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';

const API_BASE_URL = "https://gangaridai-auction.onrender.com";

const LiveBiddingSystem = () => {
    const navigate = useNavigate();
    const [liveAuctions, setLiveAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLiveAuctions();
        // Auto-refresh every 5 seconds for real-time updates
        const interval = setInterval(fetchLiveAuctions, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchLiveAuctions = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/auctions`);
            // Filter only live auctions
            const live = data.filter(auction => auction.status === 'Live');
            setLiveAuctions(live);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching live auctions:", error);
            setLoading(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/assets/default-coin.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_BASE_URL}${imagePath}`;
    };

    const handleMonitor = (auctionId) => {
        navigate(`/admin/auctions/live/${auctionId}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress size={60} color="error" />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 5 }}>
            {/* Header */}
            <Box sx={{ bgcolor: '#d32f2f', color: 'white', py: 3, mb: 4, boxShadow: 2 }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <GavelIcon sx={{ fontSize: 40 }} />
                            <Box>
                                <Typography variant="h4" fontWeight="bold">
                                    🔴 Live Bidding System
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Monitor all active auctions in real-time
                                </Typography>
                            </Box>
                        </Box>
                        <Chip
                            label={`${liveAuctions.length} Live Auctions`}
                            sx={{ bgcolor: 'white', color: '#d32f2f', fontWeight: 'bold', fontSize: '1rem', px: 2, py: 3 }}
                        />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Back Button */}
                <Button
                    variant="outlined"
                    onClick={() => navigate('/admin')}
                    sx={{ mb: 3 }}
                >
                    ← Back to Dashboard
                </Button>

                {liveAuctions.length === 0 ? (
                    <Paper sx={{ p: 5, textAlign: 'center' }}>
                        <GavelIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            No Live Auctions
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            There are currently no active auctions. Create new auctions or set them to "Live" status.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                            onClick={() => navigate('/admin/auctions')}
                        >
                            Manage Auctions
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {liveAuctions.map((auction) => (
                            <Grid item xs={12} sm={6} md={4} key={auction._id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                                    }}
                                >
                                    {/* Live Indicator */}
                                    <Box sx={{ position: 'relative' }}>
                                        <Chip
                                            label="● LIVE"
                                            color="error"
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                zIndex: 1,
                                                fontWeight: 'bold',
                                                animation: 'pulse 2s infinite'
                                            }}
                                        />
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={getImageUrl(auction.image)}
                                            alt={auction.title}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                    </Box>

                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                                            {auction.title}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Current Bid:
                                            </Typography>
                                            <Typography variant="h6" color="primary" fontWeight="bold">
                                                ৳{auction.currentBid?.toLocaleString() || auction.startingBid?.toLocaleString()}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <AccessTimeIcon fontSize="small" color="action" />
                                            <Typography variant="caption" color="text.secondary">
                                                {auction.totalBids || 0} bids placed
                                            </Typography>
                                        </Box>

                                        {auction.endTime && (
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Ends: {new Date(auction.endTime).toLocaleString()}
                                            </Typography>
                                        )}
                                    </CardContent>

                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="error"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => handleMonitor(auction._id)}
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            Monitor Live
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Auto-refresh indicator */}
            <Box sx={{ position: 'fixed', bottom: 20, right: 20, bgcolor: 'white', px: 2, py: 1, borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    🔄 Auto-refreshing every 5s
                </Typography>
            </Box>

            <style>
                {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
            </style>
        </Box>
    );
};

export default LiveBiddingSystem;

