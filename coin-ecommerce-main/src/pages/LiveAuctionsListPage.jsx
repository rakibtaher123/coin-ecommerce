import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Typography, Box, Chip, Paper, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuctionItemCard from '../components/AuctionItemCard';

const LiveAuctionsListPage = () => {
    const navigate = useNavigate();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all active auctions from backend
    const fetchAuctions = async () => {
        try {
            const { data } = await axios.get('https://gangaridai-auction.onrender.com/api/auctions');

            // Filter for active/live auctions only
            const activeAuctions = data.filter(a =>
                a.status && ['active', 'live'].includes(a.status.toLowerCase())
            );

            // Transform to match AuctionItemCard expected format
            const formattedAuctions = activeAuctions.map(auction => ({
                id: auction._id,
                title: auction.productName,
                image: auction.productImage ? `https://gangaridai-auction.onrender.com${auction.productImage}` : '/assets/default-coin.jpg',
                currentBid: auction.currentPrice || auction.startingPrice || 0,
                totalBids: auction.bids?.length || 0,
                endDate: auction.endTime,
                category: auction.category || 'Numismatics',
                lotNumber: auction.lotNumber
            }));

            setAuctions(formattedAuctions);
            setLoading(false);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch auctions:', err);
            setError('Failed to load auctions');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctions();

        // Auto-refresh every 5 seconds to show admin updates
        const interval = setInterval(fetchAuctions, 5000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading Live Auctions...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 2 }}>
                    🔴 Live Auctions
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Join our live auctions and bid on exclusive numismatic treasures
                </Typography>
                <Chip
                    label={`${auctions.length} Active Auction${auctions.length !== 1 ? 's' : ''}`}
                    color="error"
                    sx={{ mt: 2, fontWeight: 'bold' }}
                />
            </Box>

            {/* Auctions Grid */}
            {auctions.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#f9f9f9' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Live Auctions Currently
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Check back soon or browse our e-auction catalog
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={4}>
                    {auctions.map((auction) => (
                        <Grid item xs={12} sm={6} md={4} key={auction.id}>
                            <Box onClick={() => navigate(`/auction/live/${auction.id}`)}>
                                <AuctionItemCard item={auction} />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Auto-refresh indicator */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    ● Auctions update automatically every 5 seconds
                </Typography>
            </Box>
        </Container>
    );
};

export default LiveAuctionsListPage;

