import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button, Paper, Stack, Divider, TextField, InputAdornment, Chip
} from '@mui/material';
import { PictureAsPdf, Visibility, List, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ArchivesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auctions');

      // Filter closed and sold auctions for archives
      const closedAuctions = data.filter(a => a.status === 'closed' || a.status === 'sold');

      setArchives(closedAuctions);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch archives:', err);
      setLoading(false);
    }
  };

  const displayedArchives = archives.filter(item =>
    searchQuery === '' ||
    item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography>Loading Archives...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6, minHeight: '80vh' }}>

      {/* Header with Tabs */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 3 }}>
          Auction Archives
        </Typography>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search past auctions (e.g., 'Mughal Bengal')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mt: 2, bgcolor: 'white', borderRadius: 1 }}
        />
      </Box>

      {/* Archives Grid */}
      {displayedArchives.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#f9f9f9' }}>
          <Typography variant="h6" color="text.secondary">
            No archived auctions found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Completed auctions will appear here
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={4}>
          {displayedArchives.map((auction) => (
            <Paper
              key={auction._id}
              elevation={2}
              sx={{
                display: 'flex',
                overflow: 'hidden',
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              {/* Left: Image */}
              <Box
                sx={{
                  width: 280,
                  minHeight: 300,
                  bgcolor: '#8B0000',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3
                }}
              >
                <Box
                  component="img"
                  src={auction.productImage ? `http://localhost:5000${auction.productImage}` : '/assets/default-coin.jpg'}
                  alt={auction.productName}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '250px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                  }}
                />
              </Box>

              {/* Center: Details */}
              <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#2c3e50' }}>
                  {auction.productName}
                </Typography>

                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  Lot #{auction.lotNumber} | {auction.category || 'Numismatics'}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" sx={{ color: '#777', mb: 1 }}>
                  Auction Closed: {new Date(auction.soldDate || auction.endTime).toLocaleDateString('en-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>

                {/* Estimate and Realized Price */}
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
                    Estimate: ৳{auction.minEstimate?.toLocaleString()} - ৳{auction.maxEstimate?.toLocaleString()}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: '#666', mr: 1 }}>
                      Realized Price:
                    </Typography>
                    {auction.finalPrice || auction.currentPrice ? (
                      <Typography variant="h6" component="span" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                        ৳ {(auction.finalPrice || auction.currentPrice).toLocaleString()}
                      </Typography>
                    ) : (
                      <Typography variant="body2" component="span" sx={{ color: '#999', fontStyle: 'italic' }}>
                        Unsold
                      </Typography>
                    )}
                  </Box>
                  {auction.bids && auction.bids.length > 0 && (
                    <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 1 }}>
                      Total Bids: {auction.bids.length}
                    </Typography>
                  )}
                </Box>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<List />}
                    onClick={() => navigate(`/realization/${auction._id}`)}
                    sx={{
                      borderColor: '#d32f2f',
                      color: '#d32f2f',
                      '&:hover': { bgcolor: '#d32f2f', color: 'white', borderColor: '#d32f2f' }
                    }}
                  >
                    Realization
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => navigate(`/auction/live/${auction._id}`)}
                    sx={{
                      borderColor: '#d32f2f',
                      color: '#d32f2f',
                      '&:hover': { bgcolor: '#d32f2f', color: 'white', borderColor: '#d32f2f' }
                    }}
                  >
                    View Details
                  </Button>
                </Stack>
              </Box>

              {/* Right: Stats */}
              <Box
                sx={{
                  width: 220,
                  bgcolor: '#f9f9f9',
                  p: 3,
                  borderLeft: '1px solid #e0e0e0'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                  Auction Details
                </Typography>

                <Stack spacing={1.5} divider={<Divider />}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#666' }}>Status</Typography>
                    <Chip
                      label="Closed"
                      size="small"
                      sx={{ mt: 0.5, bgcolor: '#9e9e9e', color: 'white', fontWeight: 'bold' }}
                    />
                  </Box>

                  {auction.winner && (
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666' }}>Winner</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        Sold
                      </Typography>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="caption" sx={{ color: '#666' }}>Starting Price</Typography>
                    <Typography variant="body2">৳{auction.startingPrice?.toLocaleString()}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: '#666' }}>Increment</Typography>
                    <Typography variant="body2">৳{auction.incrementAmount || 100}</Typography>
                  </Box>
                </Stack>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default ArchivesPage;