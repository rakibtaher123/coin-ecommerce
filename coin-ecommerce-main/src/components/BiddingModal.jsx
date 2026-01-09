import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import { useCart } from '../context/CartProvider';

const API_BASE_URL = "https://gangaridai-auction.onrender.com";

const BiddingModal = ({ auction, isOpen, onClose, onBidPlaced }) => {
    const [bidAmount, setBidAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { addToCart } = useCart();

    if (!auction) return null;

    // Calculate minimum bid (5% increment or 500 BDT, whichever is higher)
    const currentBid = auction.highestBid || auction.basePrice || auction.currentBid || 0;
    const minIncrementByPercent = Math.ceil(currentBid * 0.05);
    const minIncrement = Math.max(minIncrementByPercent, 500);
    const minBid = currentBid + minIncrement;

    const handlePlaceBid = async () => {
        const bidValue = parseFloat(bidAmount);

        // Validation
        if (!bidAmount || isNaN(bidValue) || bidValue <= 0) {
            setError('Please enter a valid bid amount');
            return;
        }

        if (bidValue < minBid) {
            setError(`Minimum bid is ৳${minBid.toLocaleString()}`);
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Get user info from localStorage
            const token = localStorage.getItem('token');
            const userEmail = localStorage.getItem('userEmail');

            if (!token || !userEmail) {
                setError('Please login to place a bid');
                setLoading(false);
                return;
            }

            // Submit bid to backend (Corrected Route & Payload)
            const response = await axios.post(
                `${API_BASE_URL}/api/auctions/bid`,
                {
                    auctionId: auction._id,
                    bidAmount: bidValue
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Success
            if (response.data) {
                if (onBidPlaced) {
                    onBidPlaced(response.data);
                }

                // ✅ Add auction product to cart automatically
                const cartProduct = {
                    _id: auction._id,
                    name: auction.productName || auction.name,
                    price: bidValue,
                    image: auction.productImage || auction.image,
                    category: auction.category,
                    countInStock: 1, // Auction items are usually unique
                    description: `Auction Bid - ${auction.category}`
                };

                addToCart(cartProduct, 1);

                // Reset and close
                setBidAmount('');
                onClose();

                // Show success message with cart confirmation
                alert(`✅ Bid placed successfully! Amount: ৳${bidValue.toLocaleString()}\n\n🛒 Product has been added to your cart.`);
            }
        } catch (error) {
            console.error('Error placing bid:', error);
            const errorMsg = error.response?.data?.message || 'Failed to place bid. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setBidAmount('');
            setError('');
            onClose();
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#1b5e20', color: 'white' }}>
                <GavelIcon />
                Place Your Bid
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        {auction.productName || auction.name || auction.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Category: {auction.category}
                    </Typography>
                </Box>

                <Box sx={{
                    p: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    mb: 2,
                    border: '2px solid #1b5e20'
                }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Highest Bid
                    </Typography>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                        ৳{currentBid.toLocaleString()}
                    </Typography>
                </Box>

                <TextField
                    fullWidth
                    label="Your Bid Amount (৳)"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => {
                        setBidAmount(e.target.value);
                        setError('');
                    }}
                    placeholder={`Minimum: ৳${minBid.toLocaleString()}`}
                    inputProps={{
                        min: minBid,
                        step: 100
                    }}
                    sx={{ mb: 2 }}
                    disabled={loading}
                    error={!!error}
                    helperText={error || `Minimum bid: ৳${minBid.toLocaleString()} (${minIncrement} BDT increment)`}
                />

                {auction.endTime && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1.5,
                        bgcolor: '#fff3e0',
                        borderRadius: 1,
                        border: '1px solid #ffb74d'
                    }}>
                        <AccessTimeIcon fontSize="small" color="warning" />
                        <Typography variant="caption" color="warning.dark">
                            Auction ends: {new Date(auction.endTime).toLocaleString()}
                        </Typography>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    variant="outlined"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handlePlaceBid}
                    disabled={loading || !bidAmount || parseFloat(bidAmount) < minBid}
                    variant="contained"
                    color="success"
                    startIcon={loading ? <CircularProgress size={20} /> : <GavelIcon />}
                    sx={{ minWidth: 150 }}
                >
                    {loading ? 'Placing Bid...' : 'Place Bid'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BiddingModal;

