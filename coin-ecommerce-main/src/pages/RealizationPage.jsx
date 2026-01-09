import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

const RealizationPage = () => {
    // id here will be the month-year string, e.g., "December 2024"
    const { id } = useParams();
    const [lots, setLots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRealizations();
    }, [id]);

    const fetchRealizations = async () => {
        try {
            const response = await axios.get('https://gangaridai-auction.onrender.com/api/auctions');
            const allAuctions = response.data;

            // Filter Logic:
            // 1. Must be 'closed'
            // 2. Must match the Month-Year from the URL parameter (which is the grouping key)
            const filtered = allAuctions.filter(auction => {
                if (auction.status !== 'closed') return false;

                const auctionDate = new Date(auction.endTime);
                const monthYear = auctionDate.toLocaleString('default', { month: 'long', year: 'numeric' });

                return monthYear === id;
            });

            // Format for display
            const formattedLots = filtered.map(auction => {
                // Determine if sold or unsold
                // Condition: Has a winner/highestBidder ? Sold : Unsold
                const isSold = auction.winner || auction.highestBidder;
                const price = isSold ? auction.currentPrice : "Unsold";

                return {
                    id: auction._id,
                    lot: auction.lotNumber || "Lot #" + auction.productId.toString().slice(-4),
                    price: price,
                    isUnsold: !isSold
                };
            });

            // Sort by Lot Number (if numeric) or standard
            formattedLots.sort((a, b) => {
                const numA = parseInt(a.lot.replace(/\D/g, '')) || 0;
                const numB = parseInt(b.lot.replace(/\D/g, '')) || 0;
                return numA - numB;
            });

            setLots(formattedLots);
            setLoading(false);

        } catch (error) {
            console.error("Error fetching realization data:", error);
            setLoading(false);
        }
    };

    if (loading) return <Container sx={{ py: 10, textAlign: 'center' }}><CircularProgress /></Container>;

    return (
        <Container sx={{ py: 5 }}>
            <Typography variant="h5" sx={{ mb: 4, color: '#333' }}>
                Realization – {id || "Auction Details"}
            </Typography>

            <Grid container spacing={1}>
                {lots.map((item) => (
                    <Grid item xs={6} sm={4} md={2} key={item.id}>
                        {/* Lot Box */}
                        <Box sx={{ border: '1px solid #ccc', bgcolor: '#fff' }}>

                            {/* Header: Lot | Price */}
                            <Box sx={{
                                bgcolor: '#263238', // Dark Grey/Black
                                color: '#fff',
                                display: 'flex',
                                justifyContent: 'space-between',
                                px: 1.5, py: 0.5,
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }}>
                                <span>Lot {item.lot}</span>
                                <span>৳</span>
                            </Box>

                            {/* Body: Price or Unsold */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center', // Center content
                                alignItems: 'center',
                                px: 1.5, py: 1,
                                fontSize: '0.9rem',
                                bgcolor: '#fcfcfc',
                                minHeight: '35px'
                            }}>
                                <span style={{
                                    color: item.isUnsold ? '#d32f2f' : '#000',
                                    fontWeight: 'bold',
                                    fontSize: item.isUnsold ? '0.8rem' : '1rem'
                                }}>
                                    {item.isUnsold ? "Unsold" : item.price}
                                </span>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
            {lots.length === 0 && (
                <Typography sx={{ mt: 4, textAlign: 'center', width: '100%', color: 'text.secondary' }}>
                    No items found for this auction realization.
                </Typography>
            )}
        </Container>
    );
};

export default RealizationPage;

