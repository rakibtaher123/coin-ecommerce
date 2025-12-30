import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import axios from 'axios';

const API_BASE_URL = "http://localhost:5000";

const BidHistoryPage = () => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserBidHistory();
    }, []);

    const fetchUserBidHistory = async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');

            if (!userEmail) {
                setError('Please login to view your bid history');
                setLoading(false);
                return;
            }

            const { data } = await axios.get(`${API_BASE_URL}/api/bids/user/${userEmail}`);
            setBids(data.bids || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching bid history:', err);
            setError('Failed to load bid history');
            setLoading(false);
        }
    };

    const getStatusChip = (status, isWinning) => {
        if (status === 'Live') {
            return isWinning ? (
                <Chip label="Winning" color="success" size="small" icon={<TrophyIcon />} />
            ) : (
                <Chip label="Outbid" color="warning" size="small" />
            );
        } else if (status === 'Ended') {
            return isWinning ? (
                <Chip label="Won" color="success" size="small" icon={<TrophyIcon />} />
            ) : (
                <Chip label="Lost" color="error" size="small" />
            );
        }
        return <Chip label={status} size="small" />;
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <GavelIcon sx={{ fontSize: 40, color: '#1b5e20' }} />
                <Typography variant="h4" fontWeight="bold">
                    My Bid History
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {bids.length === 0 && !error ? (
                <Paper sx={{ p: 5, textAlign: 'center' }}>
                    <GavelIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary">
                        No Bid History
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        You haven't placed any bids yet. Visit live auctions to start bidding!
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                <TableCell><strong>Product</strong></TableCell>
                                <TableCell><strong>Category</strong></TableCell>
                                <TableCell align="right"><strong>Bid Amount</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell align="center"><strong>Status</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bids.map((bid, index) => (
                                <TableRow key={index} hover>
                                    <TableCell>{bid.productName}</TableCell>
                                    <TableCell>{bid.category}</TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body1" fontWeight="bold" color="primary">
                                            ৳{bid.bidAmount.toLocaleString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(bid.timestamp).toLocaleString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        {getStatusChip(bid.auctionStatus, bid.isWinning)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {bids.length > 0 && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Total Bids: {bids.length}
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default BidHistoryPage;
