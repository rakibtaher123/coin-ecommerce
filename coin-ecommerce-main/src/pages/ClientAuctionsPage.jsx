import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Grid, Card, CardMedia, CardContent, Typography, Button,
    Box, AppBar, Toolbar, IconButton, Chip, Paper
} from '@mui/material';
import { ArrowBack, Gavel, AccessTime, TrendingUp } from '@mui/icons-material';

const ClientAuctionsPage = () => {
    const navigate = useNavigate();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        try {
            const response = await fetch('https://gangaridai-auction.onrender.com/api/auctions');
            const data = await response.json();
            setAuctions(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching auctions:', error);
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'live': return 'error';
            case 'upcoming': return 'warning';
            case 'ended': return 'default';
            default: return 'info';
        }
    };

    const handleJoinAuction = (auctionId) => {
        navigate(`/auction/live?id=${auctionId}`);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* Header */}
            <AppBar position="sticky" sx={{ bgcolor: '#1b5e20' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => navigate('/client')}>
                        <ArrowBack />
                    </IconButton>
                    <Gavel sx={{ ml: 2, mr: 1 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Live Auctions
                    </Typography>
                    <Chip
                        icon={<TrendingUp />}
                        label={`${auctions.filter(a => a.status === 'live').length} Live Now`}
                        color="error"
                        sx={{ fontWeight: 'bold' }}
                    />
                </Toolbar>
            </AppBar>

            <Container sx={{ py: 4 }}>
                {/* Page Title */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Auction Marketplace
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Bid on rare coins and banknotes. Join live auctions or browse upcoming events.
                    </Typography>
                </Box>

                {loading ? (
                    <Typography>Loading auctions...</Typography>
                ) : auctions.length === 0 ? (
                    <Paper sx={{ p: 6, textAlign: 'center' }}>
                        <Gavel sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No auctions available at the moment
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Check back later for exciting auction events!
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {auctions.map((auction) => (
                            <Grid item xs={12} md={6} lg={4} key={auction._id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {/* Auction Image */}
                                    <Box sx={{ position: 'relative' }}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={auction.image || '/placeholder-coin.jpg'}
                                            alt={auction.title}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <Chip
                                            label={auction.status || 'Upcoming'}
                                            color={getStatusColor(auction.status)}
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase'
                                            }}
                                            size="small"
                                        />
                                    </Box>

                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        {/* Category */}
                                        <Chip
                                            label={auction.category || 'Numismatics'}
                                            size="small"
                                            sx={{ mb: 1, alignSelf: 'flex-start' }}
                                        />

                                        {/* Title */}
                                        <Typography variant="h6" gutterBottom>
                                            {auction.title}
                                        </Typography>

                                        {/* Description */}
                                        {auction.description && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {auction.description.substring(0, 100)}...
                                            </Typography>
                                        )}

                                        {/* Price Info */}
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Base Price
                                            </Typography>
                                            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                                                ৳{auction.basePrice?.toLocaleString() || 'N/A'}
                                            </Typography>
                                            {auction.currentBid && (
                                                <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                                                    Current Bid: ৳{auction.currentBid.toLocaleString()}
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Timing */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <AccessTime fontSize="small" color="action" />
                                            <Typography variant="caption" color="text.secondary">
                                                {auction.startTime ? `Starts: ${formatDate(auction.startTime)}` : 'Time TBA'}
                                            </Typography>
                                        </Box>

                                        {/* Action Button */}
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            disabled={auction.status === 'ended'}
                                            onClick={() => handleJoinAuction(auction._id)}
                                            sx={{ mt: 'auto' }}
                                            startIcon={<Gavel />}
                                        >
                                            {auction.status === 'live' ? 'Join Live Auction' :
                                                auction.status === 'ended' ? 'Auction Ended' : 'View Details'}
                                        </Button>
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

export default ClientAuctionsPage;

