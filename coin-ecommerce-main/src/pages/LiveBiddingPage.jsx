import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Paper, Button, Chip, TextField, InputAdornment, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Countdown from 'react-countdown';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LiveBiddingPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [auctions, setAuctions] = useState([]);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    useEffect(() => {
        fetchActiveAuctions();
        const interval = setInterval(fetchActiveAuctions, 3000);
        return () => clearInterval(interval);
    }, [user]);

    const fetchActiveAuctions = async () => {
        try {
            // Trigger status check
            await axios.get('http://localhost:5000/api/auctions/utils/check-status');

            const { data } = await axios.get('http://localhost:5000/api/auctions');

            // Show active auctions + closed auctions where current user is winner
            const relevantAuctions = data.filter(a => {
                if (a.status === 'active') return true;
                if (a.status === 'closed' && user && a.winner === user.id) return true;
                return false;
            });

            if (relevantAuctions.length > 0) {
                setAuctions(relevantAuctions);
                if (!selectedAuction || !relevantAuctions.find(a => a._id === selectedAuction._id)) {
                    setSelectedAuction(relevantAuctions[0]);
                } else {
                    const updated = relevantAuctions.find(a => a._id === selectedAuction._id);
                    setSelectedAuction(updated);
                }
            } else {
                setAuctions([]);
                setSelectedAuction(null);
            }
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch auctions:', err);
            setLoading(false);
        }
    };

    const handlePlaceBid = async () => {
        if (!user) {
            alert('Please login to bid!');
            navigate('/login');
            return;
        }

        const amount = parseFloat(bidAmount);

        // Logic: If no bids yet, min bid is starting price. If bids exist, must be currentPrice + increment.
        const currentVal = Number(selectedAuction.currentPrice || selectedAuction.startingPrice || 0);
        const hasBids = selectedAuction.bids && selectedAuction.bids.length > 0;
        const incrementVal = Number(selectedAuction.incrementAmount || 100);

        const minNextBid = hasBids ? (currentVal + incrementVal) : currentVal;

        if (!amount || amount < minNextBid) {
            setError(`Minimum bid: ৳${minNextBid.toLocaleString()}`);
            setTimeout(() => setError(null), 3000);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/auctions/bid',
                { auctionId: selectedAuction._id, bidAmount: amount },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccessMsg('✅ Bid Placed Successfully!');
            setBidAmount('');
            fetchActiveAuctions();
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to place bid');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handlePayment = async () => {
        if (!user) {
            alert('Please login to proceed with payment!');
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:5000/api/auctions/${selectedAuction._id}/pay`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccessMsg('🎉 Payment Successful! Item moved to Archives.');
            setTimeout(() => {
                navigate('/auction/archives');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Payment failed');
            setTimeout(() => setError(null), 3000);
        }
    };

    // Countdown renderer
    const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span style={{ color: 'red', fontWeight: 'bold' }}>Auction Ended!</span>;
        }
        return (
            <span style={{ color: '#ff5722', fontWeight: 'bold', fontSize: '24px' }}>
                {days > 0 && `${days}d `}{hours}h {minutes}m {seconds}s
            </span>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Typography>Loading Live Auctions...</Typography>
            </Box>
        );
    }

    if (!selectedAuction) {
        return (
            <div style={styles.noLiveContainer}>
                <Typography variant="h4" sx={{ mb: 2, color: '#fff' }}>No Live Auction Currently</Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#bbb' }}>
                    Check upcoming auctions or browse our catalog
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/auction/live')}>
                    Browse All Auctions
                </Button>
            </div>
        );
    }

    const isWinner = selectedAuction.status === 'closed' && user && selectedAuction.winner === user.id;
    const isActive = selectedAuction.status === 'active';
    const currentPrice = Number(selectedAuction.currentPrice || selectedAuction.startingPrice || 0);
    const minIncrement = Number(selectedAuction.incrementAmount || 100);

    return (
        <div style={styles.liveContainer}>
            {/* Left Side - Video Feed & Info */}
            <div style={styles.videoSection}>
                <div style={styles.videoPlaceholder}>
                    <div style={styles.liveIndicator}>
                        {isActive ? '● LIVE' : '✓ CLOSED'}
                    </div>

                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                        {isActive ? '🔴 Live Auction Feed' : '🏁 Auction Ended'}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        {selectedAuction.productName}
                    </Typography>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Chip
                            label={`Lot ${selectedAuction.lotNumber || 'N/A'}`}
                            sx={{ mb: 2, bgcolor: '#fff', fontWeight: 'bold', fontSize: '14px' }}
                        />
                        <Typography variant="body2" sx={{ color: '#bbb', fontSize: '16px' }}>
                            Category: {selectedAuction.category || 'Numismatics'}
                        </Typography>
                    </Box>

                    {selectedAuction.productImage && (
                        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                            <img
                                src={`http://localhost:5000${selectedAuction.productImage}`}
                                alt={selectedAuction.productName}
                                style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px' }}
                            />
                        </Box>
                    )}
                </div>

                <div style={styles.currentItemBox}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {isActive ? 'Currently Selling' : 'Final Result'}: {selectedAuction.productName}
                    </Typography>
                    <Typography variant="h4" sx={{ color: isActive ? '#4caf50' : '#ffd700', fontWeight: 'bold', mb: 1 }}>
                        {isActive ? 'Current Price' : 'Winning Price'}: ৳ {currentPrice.toLocaleString()}
                    </Typography>
                    {isActive && (
                        <Typography variant="caption" sx={{ color: '#bbb' }}>
                            Min Increment: ৳{minIncrement}
                        </Typography>
                    )}
                </div>
            </div>

            {/* Right Side - Bid Log & Controls */}
            <div style={styles.bidLogSection}>
                <Typography variant="h6" style={styles.logHeader}>
                    {isWinner ? '🎉 You Won This Auction!' : isActive ? 'Real-Time Bid Log' : 'Auction Closed'}
                </Typography>

                {/* Success/Error Messages */}
                {successMsg && <Alert severity="success" sx={{ m: 2 }}>{successMsg}</Alert>}
                {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

                {/* Winner Payment Section */}
                {isWinner ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Paper elevation={3} sx={{ p: 4, bgcolor: '#fff3cd', border: '2px solid #ffd700' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#856404', mb: 2 }}>
                                🏆 Congratulations!
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                You won this auction with a bid of:
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 3 }}>
                                ৳ {currentPrice.toLocaleString()}
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={handlePayment}
                                sx={{
                                    bgcolor: '#ffd700',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    py: 2,
                                    '&:hover': { bgcolor: '#ffed4e' }
                                }}
                            >
                                Proceed to Payment
                            </Button>
                        </Paper>
                    </Box>
                ) : (
                    <>
                        {/* Timer for active auctions */}
                        {isActive && (
                            <Box sx={{ p: 2, bgcolor: '#fff3cd', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: '#856404' }}>
                                    ⏰ Time Remaining:
                                </Typography>
                                <Countdown date={new Date(selectedAuction.endTime)} renderer={countdownRenderer} />
                            </Box>
                        )}

                        {/* Bid List */}
                        <div style={styles.bidList}>
                            {selectedAuction.bids && selectedAuction.bids.length > 0 ? (
                                [...selectedAuction.bids].reverse().slice(0, 20).map((bid, index) => (
                                    <div key={index} style={{
                                        ...styles.bidRow,
                                        backgroundColor: index === 0 ? '#e8f5e9' : 'transparent'
                                    }}>
                                        <span style={styles.bidTime}>
                                            {new Date(bid.time).toLocaleTimeString()}
                                        </span>
                                        <span style={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>
                                            {bid.user?.name || 'User'} bid
                                        </span>
                                        <span style={{
                                            ...styles.bidAmount,
                                            fontSize: index === 0 ? '16px' : '14px',
                                            fontWeight: index === 0 ? 'bold' : 'normal'
                                        }}>
                                            ৳{bid.amount?.toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <Box sx={{ p: 3, textAlign: 'center', color: '#999' }}>
                                    <Typography variant="body2">No bids yet. Be the first to bid!</Typography>
                                </Box>
                            )}
                        </div>

                        {/* Bidding Controls - Only for active auctions */}
                        {isActive && (
                            <div style={styles.bidControls}>
                                <Typography variant="caption" sx={{ display: 'block', mb: 1.5, color: '#d32f2f', fontWeight: 'bold' }}>
                                    Required Min Bid: ৳ {(currentPrice + (selectedAuction.bids?.length > 0 ? minIncrement : 0)).toLocaleString()}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    {[1, 5, 10].map((multiplier) => {
                                        const amount = currentPrice + (minIncrement * multiplier);
                                        return (
                                            <Button
                                                key={multiplier}
                                                size="small"
                                                variant="contained"
                                                onClick={() => setBidAmount(amount.toString())}
                                                sx={{
                                                    flex: 1,
                                                    fontSize: '11px',
                                                    bgcolor: '#1a237e',
                                                    '&:hover': { bgcolor: '#000051' }
                                                }}
                                            >
                                                Bid ৳{amount.toLocaleString()}
                                            </Button>
                                        );
                                    })}
                                </Box>

                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Enter Your Total Bid"
                                    type="number"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">৳</InputAdornment>,
                                        endAdornment: bidAmount && (
                                            <InputAdornment position="end">
                                                <Button size="small" onClick={() => setBidAmount('')} sx={{ minWidth: 0, p: 0.5 }}>×</Button>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ mb: 1, '& input': { fontWeight: 'bold', fontSize: '1.2rem' } }}
                                />

                                {bidAmount && (
                                    <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 2, border: '1px solid #c8e6c9', textAlign: 'center' }}>
                                        <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                            আপনার মোট বিড: ৳ {Number(bidAmount).toLocaleString()}
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', color: '#666' }}>
                                            (Current Price ৳ {currentPrice.toLocaleString()} + Increment)
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{ mt: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 2, border: '1px dashed #ccc' }}>
                                    <Typography variant="caption" sx={{ display: 'block', color: '#666', fontWeight: 'bold', mb: 0.5 }}>
                                        💡 Bidding Guide:
                                    </Typography>
                                    <Typography variant="caption" sx={{ display: 'block', color: '#888', lineHeight: 1.4 }}>
                                        ১. বক্সের সংখ্যাটি আপনার **মোট বিড (Total Bid)**।<br />
                                        ২. এটি বর্তমান দামের চেয়ে অন্তত ৳ {minIncrement} বেশি হতে হবে।<br />
                                        ৩. যেমন: ১১,০০০ + ১০০ = ১১,১০০ টাকা।
                                    </Typography>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handlePlaceBid}
                                    sx={{
                                        mt: 2,
                                        bgcolor: '#2e7d32',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        py: 1.5,
                                        '&:hover': { bgcolor: '#1b5e20' }
                                    }}
                                >
                                    PLACE BID
                                </Button>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 1 }}
                                    onClick={() => navigate(`/auction/live/${selectedAuction._id}`)}
                                >
                                    View Full Details
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {/* Other Auctions */}
                {auctions.length > 1 && (
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderTop: '1px solid #eee' }}>
                        <Typography variant="caption" sx={{ mb: 1, display: 'block', color: '#666', fontWeight: 'bold' }}>
                            Other Live Auctions ({auctions.length - 1})
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {auctions.filter(a => a._id !== selectedAuction._id).map(auction => (
                                <Chip
                                    key={auction._id}
                                    label={auction.productName}
                                    onClick={() => setSelectedAuction(auction)}
                                    size="small"
                                    sx={{ cursor: 'pointer' }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </div>
        </div>
    );
};

const styles = {
    noLiveContainer: {
        padding: '50px',
        textAlign: 'center',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #1a1a1a, #2c3e50)',
    },
    liveContainer: {
        display: 'flex',
        height: '90vh',
        maxHeight: '100vh',
    },
    videoSection: {
        flex: 2,
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    videoPlaceholder: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a1a1a, #2c3e50)',
        position: 'relative',
        padding: '40px',
        overflowY: 'auto',
    },
    liveIndicator: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: '#ff0000',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontWeight: 'bold',
        fontSize: '14px',
        boxShadow: '0 2px 10px rgba(255,0,0,0.5)',
    },
    currentItemBox: {
        padding: '24px',
        backgroundColor: '#1a1a1a',
        borderTop: '3px solid #d32f2f',
    },
    bidLogSection: {
        flex: 1,
        backgroundColor: '#fff',
        borderLeft: '2px solid #ccc',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
    },
    logHeader: {
        padding: '16px',
        margin: 0,
        backgroundColor: '#f5f5f5',
        borderBottom: '2px solid #e0e0e0',
        fontWeight: 'bold',
    },
    bidList: {
        flex: 1,
        overflowY: 'auto',
        padding: '10px',
        backgroundColor: '#fafafa',
    },
    bidRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 8px',
        borderBottom: '1px solid #eee',
        fontSize: '14px',
        transition: 'background-color 0.2s',
    },
    bidTime: {
        color: '#999',
        fontSize: '12px',
        minWidth: '80px',
    },
    bidAmount: {
        fontWeight: 'bold',
        color: '#2e7d32',
    },
    bidControls: {
        padding: '16px',
        backgroundColor: '#fff',
        borderTop: '2px solid #e0e0e0',
    },
};

export default LiveBiddingPage;
