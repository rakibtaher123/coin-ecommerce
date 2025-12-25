import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Chip,
    Button,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GavelIcon from '@mui/icons-material/Gavel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const API_BASE_URL = "http://localhost:5000";

const LiveBiddingPage = () => {
    const navigate = useNavigate();
    const [liveAuctions, setLiveAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLiveAuctions();
        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchLiveAuctions, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchLiveAuctions = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/auctions`);
            const live = data.filter(auction => auction.status === 'Live');
            setLiveAuctions(live);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching live auctions:', error);
            setLoading(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/assets/default-coin.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_BASE_URL}${imagePath}`;
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 5, textAlign: 'center' }}>
                <CircularProgress size={60} />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="error" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    🔴 Live Bidding System
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Join live auctions and place your bids!
                </Typography>
            </Box>

            {liveAuctions.length === 0 ? (
                <Paper sx={{ p: 5, textAlign: 'center' }}>
                    <GavelIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        No Live Auctions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        There are currently no active auctions. Check back later!
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {liveAuctions.map((auction) => (
                        <Grid item xs={12} sm={6} md={4} key={auction._id}>
                            <Paper
                                sx={{
                                    p: 2,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                                }}
                            >
                                <Box sx={{ position: 'relative', mb: 2 }}>
                                    <Chip
                                        label="● LIVE"
                                        color="error"
                                        size="small"
                                        sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 'bold' }}
                                    />
                                    <img
                                        src={getImageUrl(auction.productImage)}
                                        alt={auction.productName}
                                        style={{
                                            width: '100%',
                                            height: 200,
                                            objectFit: 'cover',
                                            borderRadius: 8
                                        }}
                                    />
                                </Box>

                                <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                                    {auction.productName}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {auction.category}
                                </Typography>

                                <Box sx={{ flexGrow: 1, my: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Current Bid:
                                    </Typography>
                                    <Typography variant="h5" color="primary" fontWeight="bold">
                                        ৳{(auction.highestBid || auction.basePrice).toLocaleString()}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {auction.totalBids || 0} bids placed
                                    </Typography>
                                </Box>

                                {auction.endTime && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <AccessTimeIcon fontSize="small" color="action" />
                                        <Typography variant="caption" color="text.secondary">
                                            Ends: {new Date(auction.endTime).toLocaleString()}
                                        </Typography>
                                    </Box>
                                )}

                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    startIcon={<GavelIcon />}
                                    onClick={() => navigate(`/auction/live`)}
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Join Auction
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default LiveBiddingPage;
