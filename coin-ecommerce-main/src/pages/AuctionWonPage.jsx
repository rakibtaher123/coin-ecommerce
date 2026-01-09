import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Button, Chip, CircularProgress, Alert, Grid, Divider
} from '@mui/material';
import {
    EmojiEvents, Celebration, Payment, Receipt, ShoppingBag, ArrowBack
} from '@mui/icons-material';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { AuthContext } from '../context/AuthContext';

const AuctionWonPage = () => {
    const { auctionId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchAuction();
        // Trigger confetti celebration
        triggerConfetti();
    }, [auctionId]);

    const triggerConfetti = () => {
        // Left side
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0, y: 0.6 }
        });
        // Right side
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { x: 1, y: 0.6 }
            });
        }, 250);
    };

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

            // Verify user is the winner (only after auction is closed)
            const userId = user?.id || user?._id;
            const isWinner =
                String(data.winner) === String(userId) ||
                String(data.highestBidder?._id || data.highestBidder) === String(userId);

            if (!isWinner) {
                navigate(`/client/auction/lost/${auctionId}`);
                return;
            }

            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch auction:', err);
            setError('Failed to load auction details');
            setLoading(false);
        }
    };

    const handleProceedToPayment = async () => {
        setProcessing(true);
        try {
            // Navigate to payment page with auction details
            navigate(`/client/payment`, {
                state: {
                    auctionId: auction._id,
                    productName: auction.productName,
                    amount: auction.currentPrice,
                    type: 'auction'
                }
            });
        } catch (err) {
            console.error('Payment error:', err);
            setError('Failed to process payment');
            setProcessing(false);
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
            background: 'linear-gradient(135deg, #1a237e 0%, #4a148c 50%, #880e4f 100%)',
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

                {/* Winner Card */}
                <Paper
                    elevation={10}
                    sx={{
                        p: 5,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #fff9c4 0%, #ffecb3 100%)',
                        border: '4px solid #ffd700',
                        borderRadius: 4
                    }}
                >
                    {/* Trophy Icon */}
                    <EmojiEvents sx={{ fontSize: 120, color: '#ffd700', mb: 2 }} />

                    {/* Congratulations */}
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 'bold',
                            color: '#1a237e',
                            mb: 1,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        🎉 অভিনন্দন! 🎉
                    </Typography>

                    <Typography variant="h5" sx={{ color: '#4a148c', mb: 3 }}>
                        Congratulations! You won the auction!
                    </Typography>

                    <Chip
                        icon={<Celebration />}
                        label="WINNER"
                        color="success"
                        sx={{
                            fontSize: '1.2rem',
                            py: 3,
                            px: 2,
                            fontWeight: 'bold'
                        }}
                    />
                </Paper>

                {/* Auction Details */}
                <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#1a237e' }}>
                        📦 Auction Details
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

                            {/* Final Price */}
                            <Box sx={{
                                bgcolor: '#e8f5e9',
                                p: 3,
                                borderRadius: 2,
                                border: '2px solid #4caf50'
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    Final Winning Price:
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                    ৳ {auction?.currentPrice?.toLocaleString()}
                                </Typography>
                            </Box>

                            {/* Invoice ID */}
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Receipt sx={{ color: '#666' }} />
                                <Typography variant="body2" color="text.secondary">
                                    Auction ID: <strong>{auction?._id}</strong>
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Payment Button */}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Payment />}
                        onClick={handleProceedToPayment}
                        disabled={processing}
                        sx={{
                            py: 2,
                            px: 6,
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            bgcolor: '#ffd700',
                            color: '#1a237e',
                            '&:hover': {
                                bgcolor: '#ffca28',
                                transform: 'scale(1.05)'
                            },
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 20px rgba(255,215,0,0.4)'
                        }}
                    >
                        {processing ? <CircularProgress size={24} /> : '💳 Proceed to Payment'}
                    </Button>

                    <Typography variant="body2" sx={{ mt: 2, color: 'white', opacity: 0.8 }}>
                        Complete your payment to receive the item
                    </Typography>
                </Box>

                {/* More Options */}
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12} sm={6}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<ShoppingBag />}
                            onClick={() => navigate('/client/auction/bidding')}
                            sx={{
                                py: 1.5,
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            Browse More Auctions
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => navigate('/client')}
                            sx={{
                                py: 1.5,
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            Go to Dashboard
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AuctionWonPage;

