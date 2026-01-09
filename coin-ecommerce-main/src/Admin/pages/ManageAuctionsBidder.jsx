import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, IconButton, CircularProgress, Tooltip, Avatar, Grid
} from '@mui/material';
import { ArrowBack, Person, Phone, Email, Home, AssignmentInd } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "https://gangaridai-auction.onrender.com";

const ManageAuctionsBidder = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch auctions
    const fetchAuctions = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_BASE_URL}/api/auctions`);
            // Filter only auctions that have bids/bidders
            const activeAuctions = data.filter(auc => auc.highestBidder);
            setAuctions(activeAuctions);
        } catch (error) {
            console.error("❌ Error fetching auctions:", error);
            setAuctions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctions();
    }, []);

    // Image helper
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "/assets/logos/coin_hero.jpg";
        if (imagePath.startsWith("http")) return imagePath;
        return `${API_BASE_URL}${imagePath}`;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/admin/auctions')}
                    variant="outlined"
                >
                    Back
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1565c0', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentInd fontSize="large" /> Bidder Management
                </Typography>
            </Box>

            <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
                View detailed contact information for auction winners and highest bidders.
            </Typography>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                        <TableRow>
                            <TableCell><strong>Auction Item</strong></TableCell>
                            <TableCell><strong>Winning Bid</strong></TableCell>
                            <TableCell><strong>Bidder Details</strong></TableCell>
                            <TableCell><strong>Contact Info</strong></TableCell>
                            <TableCell><strong>Address</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : auctions.length === 0 ? (
                            <TableRow><TableCell colSpan={6} align="center">No active bidders found.</TableCell></TableRow>
                        ) : (
                            auctions.map((row) => (
                                <TableRow key={row._id} hover>
                                    {/* Product Info */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <img
                                                src={getImageUrl(row.productImage)}
                                                alt={row.productName}
                                                onError={(e) => e.target.src = "/assets/logos/coin_hero.jpg"}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '8px',
                                                    objectFit: 'cover',
                                                    border: '1px solid #ddd'
                                                }}
                                            />
                                            <Box>
                                                <Typography variant="body2" fontWeight="bold">{row.productName}</Typography>
                                                <Typography variant="caption" color="text.secondary">Lot: {row.lotNumber || 'N/A'}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    {/* Bid Info */}
                                    <TableCell>
                                        <Typography variant="h6" color="primary" fontWeight="bold">
                                            ৳{(row.highestBid || row.currentPrice || 0).toLocaleString()}
                                        </Typography>
                                    </TableCell>

                                    {/* Bidder Name */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>
                                                {row.highestBidder?.name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Typography variant="body1" fontWeight="bold">
                                                {row.highestBidder?.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    {/* Contact */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Email fontSize="small" color="action" />
                                                <Typography variant="body2">{row.highestBidder?.email}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Phone fontSize="small" color="action" />
                                                <Typography variant="body2">{row.highestBidder?.phone || 'N/A'}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    {/* Address */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: '200px' }}>
                                            <Home fontSize="small" color="action" />
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                                {row.highestBidder?.address || 'N/A'}, {row.highestBidder?.city || ''}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <Chip
                                            label={row.status}
                                            size="small"
                                            color={row.status === 'Live' ? 'error' : row.status === 'Upcoming' ? 'warning' : 'default'} // Updated logic
                                            variant={row.status === 'Live' ? 'filled' : 'outlined'}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ManageAuctionsBidder;

