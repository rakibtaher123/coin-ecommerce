import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Paper, Typography, List, ListItem,
  ListItemText, ListItemAvatar, Avatar, Button, Divider,
  CircularProgress, Alert, Chip
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "http://localhost:5000";

const LiveBiddingMonitor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuctionData();

    // Auto-refresh every 3 seconds for real-time monitoring
    const interval = setInterval(fetchAuctionData, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchAuctionData = async () => {
    try {
      // Fetch auction details
      const auctionResponse = await axios.get(`${API_BASE_URL}/api/auctions`);
      const foundAuction = auctionResponse.data.find(a => a._id === id);

      if (!foundAuction) {
        setError('Auction not found');
        setLoading(false);
        return;
      }

      setAuction(foundAuction);

      // Fetch bids for this auction
      try {
        const bidsResponse = await axios.get(`${API_BASE_URL}/api/bids/${id}`);
        setBids(bidsResponse.data.bids || []);
      } catch (bidError) {
        console.error('Error fetching bids:', bidError);
        // If no bids yet, just set empty array
        setBids([]);
      }

      setError('');
      setLoading(false);
    } catch (err) {
      console.error('Error fetching auction data:', err);
      setError('Failed to load auction data');
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/assets/default-coin.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    const pathWithSlash = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_BASE_URL}${pathWithSlash}`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !auction) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error || 'Auction not found'}</Alert>
        <Button variant="contained" onClick={() => navigate('/admin/auctions/live')}>
          Back to Live Auctions
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#d32f2f', display: 'flex', alignItems: 'center', gap: 1 }}>
          🔴 Live Bidding Monitor
          <Chip
            label={auction.status}
            color={auction.status === 'Live' ? 'error' : 'default'}
            size="small"
          />
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/admin/auctions/live')}>
          ← Back to Live Auctions
        </Button>
      </Box>

      <Grid container spacing={3}>

        {/* Left: Auction Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <img
              src={getImageUrl(auction.productImage)}
              alt={auction.productName}
              onError={(e) => { e.target.onerror = null; e.target.src = '/assets/default-coin.jpg'; }}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: 10, marginBottom: 15 }}
            />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {auction.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Category: {auction.category}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">Base Price</Typography>
            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
              ৳{auction.basePrice?.toLocaleString()}
            </Typography>

            <Typography variant="body2" color="text.secondary">Current Highest Bid</Typography>
            <Typography variant="h4" color="error" sx={{ mb: 2, fontWeight: 'bold' }}>
              ৳{(auction.highestBid || auction.basePrice)?.toLocaleString()}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Total Bids</Typography>
                <Typography variant="h6" fontWeight="bold">{auction.totalBids || 0}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Typography variant="h6" fontWeight="bold" color={auction.status === 'Live' ? 'error' : 'default'}>
                  {auction.status}
                </Typography>
              </Box>
            </Box>

            {auction.endTime && (
              <Box sx={{ mt: 2, p: 1.5, bgcolor: '#fff3e0', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  <AccessTimeIcon fontSize="small" color="warning" />
                  <Typography variant="caption" color="warning.dark">
                    Ends: {new Date(auction.endTime).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right: Live Bid Feed */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Live Bid Feed
              </Typography>
              <Typography variant="caption" color="text.secondary">
                🔄 Auto-refreshing every 3s
              </Typography>
            </Box>
            <Divider />

            {bids.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <GavelIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Bids Yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Waiting for the first bid...
                </Typography>
              </Box>
            ) : (
              <List sx={{ maxHeight: '500px', overflow: 'auto' }}>
                {bids.map((bid, index) => (
                  <ListItem
                    key={bid._id || index}
                    divider
                    sx={{
                      bgcolor: index === 0 ? '#e8f5e9' : 'transparent',
                      borderLeft: index === 0 ? '4px solid #4caf50' : 'none',
                      mb: 1
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: index === 0 ? '#4caf50' : '#1b5e20' }}>
                        {(bid.userName || bid.userEmail)[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {bid.userName || bid.userEmail.split('@')[0]}
                          </Typography>
                          {index === 0 && (
                            <Chip label="Highest" size="small" color="success" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body1" color="primary" fontWeight="bold">
                            Bid: ৳{bid.amount.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Time: {formatTime(bid.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default LiveBiddingMonitor;