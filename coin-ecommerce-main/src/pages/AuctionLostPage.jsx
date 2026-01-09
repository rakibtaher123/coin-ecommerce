import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Button, Chip, CircularProgress, Alert, Grid, Divider
} from '@mui/material';
import {
    SentimentDissatisfied, Gavel, Explore, ArrowBack, Refresh
} from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AuctionLostPage = () => {
    const { auctionId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userHighestBid, setUserHighestBid] = useState(null);

    useEffect(() => {
        fetchAuction();
    }, [auctionId]);

    const fetchAuction = async () => {
        try {
            // First check and update auction statuses
            await axios.get('https://gangaridai-auction.onrender.com/api/auctions/utils/check-status');

            const { data } = await axios.get(`https://gangaridai-auction.onrender.com/api/auctions/${auctionId}`);
            setAuction(data);

            // ✅ IMPORTANT: First check if auction is actually ended
            if (data.status === 'active') {
                // Auction is still running - redirect to bid status page
                navigate(`/client/auction/bid-status/${auctionId}`);
                return;
            }

            // Find user's highest bid
            const userId = user?.id || user?._id;
            if (user && data.bids) {
                const myBids = data.bids.filter(bid => {
                    const bidUserId = bid.user?._id || bid.user;
                    return String(bidUserId) === String(userId);
                });
                if (myBids.length > 0) {
                    const highest = myBids.reduce((max, bid) => bid.amount > max.amount ? bid : max, myBids[0]);
                    setUserHighestBid(highest);
                }
            }

            // Verify user is NOT the winner (redirect if they are)
            const isWinner =
                String(data.winner) === String(userId) ||
                String(data.highestBidder?._id || data.highestBidder) === String(userId);

            if (isWinner) {
                navigate(`/client/auction/win/${auctionId}`);
                return;
            }

            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch auction:', err);
            setError('Failed to load auction details');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 5 }}>
                <Alert severity="error">{error}</Alert>
                <Button onClick={() => navigate('/client')} sx={{ mt: 2 }}>
                    Back to Dashboard
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #37474f 0%, #263238 100%)',
            py: 5
        }}>
            <Container maxWidth="md">
                {/* Back Button */}
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/client')}
                    sx={{ color: 'white', mb: 3 }}
                >
                    Back to Dashboard
                </Button>

                {/* Lost Card */}
                <Paper
                    elevation={10}
                    sx={{
                        p: 5,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%)',
                        border: '2px solid #90a4ae',
                        borderRadius: 4
                    }}
                >
                    {/* Sad Icon */}
                    <SentimentDissatisfied sx={{ fontSize: 100, color: '#607d8b', mb: 2 }} />

                    {/* Message */}
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            color: '#455a64',
                            mb: 1
                        }}
                    >
                        😔 এই অকশনে জেতা হয়নি
                    </Typography>

                    <Typography variant="h6" sx={{ color: '#607d8b', mb: 3 }}>
                        Better luck next time!
                    </Typography>

                    <Chip
                        label="AUCTION ENDED"
                        sx={{
                            fontSize: '1rem',
                            py: 2.5,
                            px: 2,
                            bgcolor: '#90a4ae',
                            color: 'white'
                        }}
                    />
                </Paper>

                {/* Auction Details */}
                <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#37474f' }}>
                        📦 Auction Summary
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Image */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                bgcolor: '#f5f5f5',
                                borderRadius: 2,
                                p: 2,
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <img
                                    src={`https://gangaridai-auction.onrender.com${auction?.productImage}`}
                                    alt={auction?.productName}
                                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }}
                                />
                            </Box>
                        </Grid>

                        {/* Details */}
                        <Grid item xs={12} md={8}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                                {auction?.productName}
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <Chip label={`Lot ${auction?.lotNumber || 'N/A'}`} size="small" sx={{ mr: 1 }} />
                                <Chip label={auction?.category || 'Numismatics'} size="small" variant="outlined" />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Your Bid */}
                            {userHighestBid && (
                                <Box sx={{
                                    bgcolor: '#fff3e0',
                                    p: 2,
                                    borderRadius: 2,
                                    mb: 2,
                                    border: '1px solid #ffcc80'
                                }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Your Highest Bid:
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                                        ৳ {userHighestBid.amount?.toLocaleString()}
                                    </Typography>
                                </Box>
                            )}

                            {/* Winning Price */}
                            <Box sx={{
                                bgcolor: '#e8f5e9',
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid #a5d6a7'
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    Winning Price:
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                    ৳ {auction?.currentPrice?.toLocaleString()}
                                </Typography>
                            </Box>

                            {/* Difference */}
                            {userHighestBid && (
                                <Typography variant="body2" sx={{ mt: 2, color: '#d32f2f' }}>
                                    💡 You were ৳ {(auction?.currentPrice - userHighestBid.amount).toLocaleString()} away from winning
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </Paper>

                {/* Action Buttons */}
                <Box sx={{ mt: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={<Explore />}
                                onClick={() => navigate('/client/auction/bidding')}
                                sx={{
                                    py: 2,
                                    bgcolor: '#2e7d32',
                                    '&:hover': { bgcolor: '#1b5e20' }
                                }}
                            >
                                🔍 Explore More Auctions
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={<Gavel />}
                                onClick={() => navigate('/auction/live')}
                                sx={{
                                    py: 2,
                                    bgcolor: '#1976d2',
                                    '&:hover': { bgcolor: '#1565c0' }
                                }}
                            >
                                🎯 Join Live Auctions
                            </Button>
                        </Grid>
                    </Grid>

                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/client')}
                        sx={{
                            mt: 2,
                            py: 1.5,
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.5)',
                            '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        Go to Dashboard
                    </Button>
                </Box>

                {/* Encouragement */}
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mt: 4,
                        textAlign: 'center',
                        bgcolor: 'rgba(255,255,255,0.9)',
                        borderRadius: 3
                    }}
                >
                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 1 }}>
                        🌟 Don't Give Up!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        There are many more exciting auctions waiting for you.
                        Keep bidding and you could win next time!
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default AuctionLostPage;

