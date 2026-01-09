import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Button, Chip, CircularProgress, Alert, Grid, Divider
} from '@mui/material';
import {
    CheckCircle, Error, Gavel, Timer, TrendingUp, ArrowBack, Refresh, History
} from '@mui/icons-material';
import axios from 'axios';
import Countdown from 'react-countdown';
import { AuthContext } from '../context/AuthContext';

const BidStatusPage = () => {
    const { auctionId } = useParams();
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext); // ✅ Use loading state

    const [auction, setAuction] = useState(null);
    const [statusLoader, setStatusLoader] = useState(true); // Renamed to avoid conflict
    const [error, setError] = useState(null);
    const [userBid, setUserBid] = useState(null);
    const [isHighestBidder, setIsHighestBidder] = useState(false);

    // Fetch auction details
    const fetchAuction = async () => {
        try {
            await axios.get('https://gangaridai-auction.onrender.com/api/auctions/utils/check-status');

            const { data } = await axios.get(`https://gangaridai-auction.onrender.com/api/auctions/${auctionId}`);
            setAuction(data);

            if (user && data.bids) {
                const userId = user._id || user.id;
                const myBids = data.bids.filter(bid => {
                    const bidUserId = bid.user?._id || bid.user;
                    return String(bidUserId) === String(userId);
                });

                if (myBids.length > 0) {
                    const latestBid = myBids.sort((a, b) => new Date(b.time) - new Date(a.time))[0];
                    setUserBid(latestBid);

                    const highestBidderId = data.highestBidder?._id || data.highestBidder;
                    const isHighest = String(userId) === String(highestBidderId);
                    setIsHighestBidder(isHighest);

                    if (data.status === 'closed' || data.status === 'sold') {
                        if (isHighest) {
                            navigate(`/client/auction/win/${auctionId}`);
                        } else {
                            navigate(`/client/auction/lost/${auctionId}`);
                        }
                    }
                }
            }
            setStatusLoader(false);
        } catch (err) {
            console.error('Failed to fetch auction:', err);
            setError('Failed to load auction details');
            setStatusLoader(false);
        }
    };

    useEffect(() => {
        fetchAuction();
        const interval = setInterval(fetchAuction, 5000);
        return () => clearInterval(interval);
    }, [auctionId, user]); // Depend on user to re-calc status on login

    // Countdown renderer
    const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <Chip label="Auction Ended" color="error" sx={{ fontWeight: 'bold' }} />;
        }
        return (
            <Typography variant="h4" sx={{ color: '#ff5722', fontWeight: 'bold' }}>
                {days > 0 && `${days}d `}{hours}h {minutes}m {seconds}s
            </Typography>
        );
    };

    // 🛑 1. Handle Loading State
    if (loading || (!auction && statusLoader)) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    // 🛑 2. Handle Guest State (Not Logged In)
    // Check both AuthContext user AND localStorage token (in case context is slow)
    const token = localStorage.getItem('token');

    if (!user && !token) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Box sx={{ color: 'warning.main', fontSize: 60, mb: 2 }}>⚠️</Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Login Required
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Please log in to view your bid status and track auctions.
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => navigate('/login', { state: { from: `/client/auction/bid-status/${auctionId}` } })}
                        sx={{ py: 1.5, fontWeight: 'bold' }}
                    >
                        Login Now
                    </Button>
                </Paper>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 5 }}>
                <Alert severity="error">{error}</Alert>
                <Button onClick={() => navigate('/client/auction/bidding')} sx={{ mt: 2 }}>
                    Back to Auctions
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', py: 5 }}>
            <Container maxWidth="md">
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Button startIcon={<ArrowBack />} onClick={() => navigate('/client/auction/bidding')}>
                        Back to Live Auction
                    </Button>
                </Box>

                {/* Status Card */}
                <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
                    {/* Status Icon */}
                    {isHighestBidder ? (
                        <Box sx={{ mb: 2 }}>
                            <CheckCircle sx={{ fontSize: 80, color: '#4caf50' }} />
                            <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold', mt: 2 }}>
                                ✅ আপনি সর্বোচ্চ বিডার!
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                You are currently the highest bidder
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ mb: 2 }}>
                            <Error sx={{ fontSize: 80, color: '#ff9800' }} />
                            <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold', mt: 2 }}>
                                ⚠️ আপনাকে ছাড়িয়ে গেছে!
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Someone has outbid you. Place a higher bid to win!
                            </Typography>
                        </Box>
                    )}
                </Paper>

                {/* Auction Details */}
                <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                    <Grid container spacing={3}>
                        {/* Left - Image */}
                        <Grid item xs={12} md={5}>
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
                                    style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '8px' }}
                                />
                            </Box>
                        </Grid>

                        {/* Right - Details */}
                        <Grid item xs={12} md={7}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                                {auction?.productName}
                            </Typography>

                            <Chip label={`Lot ${auction?.lotNumber || 'N/A'}`} sx={{ mb: 2 }} />

                            <Divider sx={{ my: 2 }} />

                            {/* Your Bid */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body1" color="text.secondary">
                                    আপনার বিড:
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                    ৳ {userBid?.amount?.toLocaleString() || 'N/A'}
                                </Typography>
                            </Box>

                            {/* Current Highest Bid */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body1" color="text.secondary">
                                    বর্তমান সর্বোচ্চ বিড:
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                                    ৳ {auction?.currentPrice?.toLocaleString() || auction?.startingPrice?.toLocaleString()}
                                </Typography>
                            </Box>

                            {/* Time Remaining */}
                            <Box sx={{
                                bgcolor: '#fff3e0',
                                p: 2,
                                borderRadius: 2,
                                textAlign: 'center',
                                mt: 2
                            }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <Timer sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    সময় বাকি:
                                </Typography>
                                <Countdown date={new Date(auction?.endTime)} renderer={countdownRenderer} />
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Action Buttons */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<Gavel />}
                            onClick={() => navigate('/client/auction/bidding')}
                            sx={{
                                py: 2,
                                bgcolor: '#2e7d32',
                                '&:hover': { bgcolor: '#1b5e20' }
                            }}
                        >
                            Continue Bidding
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            startIcon={<Refresh />}
                            onClick={fetchAuction}
                            sx={{ py: 2 }}
                        >
                            Refresh Status
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            startIcon={<History />}
                            onClick={() => navigate('/client/bid-history')}
                            sx={{ py: 2 }}
                        >
                            My Bid History
                        </Button>
                    </Grid>
                </Grid>

                {/* Bid History */}
                {auction?.bids && auction.bids.length > 0 && (
                    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            📊 Recent Bids
                        </Typography>
                        {[...auction.bids].reverse().slice(0, 5).map((bid, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    py: 1,
                                    borderBottom: index < 4 ? '1px solid #eee' : 'none',
                                    bgcolor: (bid.user?._id === user?.id || bid.user === user?.id) ? '#e8f5e9' : 'transparent',
                                    px: 1,
                                    borderRadius: 1
                                }}
                            >
                                <Typography variant="body2">
                                    {bid.user?.name || 'User'}
                                    {(bid.user?._id === user?.id || bid.user === user?.id) && ' (You)'}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                    ৳ {bid.amount?.toLocaleString()}
                                </Typography>
                            </Box>
                        ))}
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default BidStatusPage;

