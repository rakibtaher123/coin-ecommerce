import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Grid, Paper, Chip, Button,
    CircularProgress, TextField, InputAdornment, Alert, IconButton
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import GavelIcon from '@mui/icons-material/Gavel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RefreshIcon from '@mui/icons-material/Refresh';

const LiveBiddingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidAmounts, setBidAmounts] = useState({}); // Store input for each auction
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Fetch auctions
    const fetchAuctions = async () => {
        try {
            const { data } = await axios.get('/api/auctions');
            // Filter active auctions (handling both 'active' and 'Live' for compatibility)
            const active = data.filter(a => ['active', 'live'].includes(a.status.toLowerCase()));
            setAuctions(active);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctions();
        const interval = setInterval(fetchAuctions, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    // Handle Bid Input Change
    const handleBidChange = (auctionId, value) => {
        setBidAmounts(prev => ({ ...prev, [auctionId]: value }));
    };

    // Place Bid Handler
    const handlePlaceBid = async (auctionId, currentPrice) => {
        const amount = parseFloat(bidAmounts[auctionId]);

        if (!amount || amount <= currentPrice) {
            setError(`Bid must be higher than ৳${currentPrice}`);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login with return path
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        try {
            setError(null);
            await axios.post('/api/auctions/bid',
                { auctionId, bidAmount: amount },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccessMsg("✅ Bid Placed Successfully!");
            setBidAmounts(prev => ({ ...prev, [auctionId]: '' })); // Clear input
            fetchAuctions(); // Refresh data immediately

            // Clear success msg
            setTimeout(() => setSuccessMsg(null), 3000);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to place bid");
        }
    };

    // Countdown Renderer
    const Countdown = ({ endTime }) => {
        const [timeLeft, setTimeLeft] = useState("");

        useEffect(() => {
            const calculateTime = () => {
                const diff = new Date(endTime) - new Date();
                if (diff <= 0) {
                    setTimeLeft("Auction Ended");
                    return;
                }
                const hours = Math.floor((diff / (1000 * 60 * 60)));
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            };
            calculateTime();
            const timer = setInterval(calculateTime, 1000);
            return () => clearInterval(timer);
        }, [endTime]);

        return (
            <Chip
                icon={<AccessTimeIcon />}
                label={timeLeft}
                color={timeLeft === "Auction Ended" ? "default" : "warning"}
                size="small"
            />
        );
    };

    if (loading) return (
        <Container sx={{ py: 10, textAlign: 'center' }}>
            <CircularProgress />
        </Container>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="error" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    🔴 Live Auctions
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Join ongoing auctions and win exclusive items!
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

            {auctions.length === 0 ? (
                <Paper sx={{ p: 5, textAlign: 'center', bgcolor: '#f9f9f9' }}>
                    <GavelIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">No Active Auctions</Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {auctions.map((auction) => (
                        <Grid item xs={12} sm={6} md={4} key={auction._id}>
                            <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                {/* Image */}
                                <Box sx={{ position: 'relative', mb: 2 }}>
                                    <Countdown endTime={auction.endTime} />
                                    <img
                                        src={auction.productImage || '/assets/default-coin.jpg'}
                                        alt={auction.productName}
                                        style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginTop: 10 }}
                                    />
                                </Box>

                                {/* Info */}
                                <Typography variant="h6" fontWeight="bold" noWrap>{auction.productName}</Typography>
                                <Typography variant="body2" color="text.secondary">{auction.category}</Typography>

                                <Box sx={{ my: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                                    <Typography variant="body2" color="text.secondary">Current Price</Typography>
                                    <Typography variant="h5" color="primary" fontWeight="bold">
                                        ৳{auction.currentPrice.toLocaleString()}
                                    </Typography>
                                    {auction.highestBidder && (
                                        <Typography variant="caption" color="success.main" fontWeight="bold">
                                            Last Bidder: {auction.highestBidder?.name || "User"}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Bid Input */}
                                <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                                    <TextField
                                        label="Amount"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        value={bidAmounts[auction._id] || ''}
                                        onChange={(e) => handleBidChange(auction._id, e.target.value)}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">৳</InputAdornment>,
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handlePlaceBid(auction._id, auction.currentPrice)}
                                    >
                                        Bid
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default LiveBiddingPage;
