import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, IconButton, CircularProgress, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import GavelIcon from '@mui/icons-material/Gavel';
import axios from 'axios';

// কম্পোনেন্ট ইম্পোর্ট
import CreateAuction from '../components/CreateAuction';

const API_BASE_URL = "https://gangaridai-auction.onrender.com";

const ManageAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedAuctionToEdit, setSelectedAuctionToEdit] = useState(null);

  // Fetch auctions
  const fetchAuctions = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching auctions from:', `${API_BASE_URL}/api/auctions`);
      const { data } = await axios.get(`${API_BASE_URL}/api/auctions`);
      console.log('✅ Auctions fetched:', data);
      console.log('📊 Number of auctions:', data.length);
      setAuctions(data);
    } catch (error) {
      console.error("❌ Error fetching auctions:", error);
      console.error("Error details:", error.response?.data || error.message);
      setAuctions([]); // fallback empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  // Delete auction
  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to delete this auction?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/auctions/${id}`);
        setAuctions(auctions.filter((auc) => auc._id !== id));
        alert("✅ Auction deleted successfully!");
      } catch (error) {
        console.error(error);
        alert("❌ Failed to delete auction.");
      }
    }
  };

  // Edit auction
  const handleEdit = (auction) => {
    setSelectedAuctionToEdit(auction);
    setOpenCreateModal(true);
  };

  // Create new auction
  const handleCreateNew = () => {
    setSelectedAuctionToEdit(null);
    setOpenCreateModal(true);
  };

  // ⚡ MANUAL: Set auction to Live immediately
  const handleSetLive = async (auction) => {
    if (window.confirm(`🔴 Set "${auction.productName}" to LIVE status?`)) {
      try {
        // ✅ Use simple PATCH endpoint - only sends status!
        await axios.patch(`${API_BASE_URL}/api/auctions/${auction._id}/status`, {
          status: 'Live'
        });

        alert("✅ Auction is now LIVE!");
        fetchAuctions(); // Refresh list
      } catch (error) {
        console.error("❌ Set Live Error:", error);
        console.error("Error details:", error.response?.data);
        alert(`❌ Failed: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // 🏁 MANUAL: End auction and move to archives
  const handleSetEnded = async (auction) => {
    if (window.confirm(`🏁 End "${auction.productName}" and move to Archives?`)) {
      try {
        await axios.patch(`${API_BASE_URL}/api/auctions/${auction._id}/status`, {
          status: 'Ended'
        });

        alert("✅ Auction ended! Check Archives page.");
        fetchAuctions(); // Refresh list
      } catch (error) {
        console.error("❌ Set Ended Error:", error);
        alert(`❌ Failed: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Image helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/logos/coin_hero.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    const pathWithSlash = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_BASE_URL}${pathWithSlash}`;
  };

  // Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'Live': return 'error';
      case 'Upcoming': return 'warning';
      case 'Ended': return 'default';
      default: return 'primary';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
          Manage Auctions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ fontWeight: 'bold' }}
          onClick={handleCreateNew}
        >
          Create New Auction
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Base Price</strong></TableCell>
              <TableCell><strong>Highest Bid</strong></TableCell>
              <TableCell><strong>Highest Bidder</strong></TableCell> {/* ✅ New Column */}
              <TableCell><strong>Time</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} align="center"><CircularProgress /></TableCell></TableRow>
            ) : auctions.length === 0 ? (
              <TableRow><TableCell colSpan={7} align="center">No auctions found.</TableCell></TableRow>
            ) : (
              auctions.map((row) => (
                <TableRow key={row._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <img
                        src={getImageUrl(row.productImage)}
                        alt={row.productName}
                        onError={(e) => e.target.src = "/assets/logos/coin_hero.jpg"}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid #ddd',
                          backgroundColor: '#f0f0f0'
                        }}
                      />
                      <Typography variant="body2" fontWeight="bold">{row.productName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>৳{(row.basePrice || 0).toLocaleString()}</TableCell>
                  <TableCell sx={{ color: 'green', fontWeight: 'bold' }}>
                    ৳{(row.currentPrice || row.startingPrice || 0).toLocaleString()}
                  </TableCell>
                  {/* ✅ Bidder Info */}
                  <TableCell>
                    {row.highestBidder ? (
                      <Box>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {row.highestBidder.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.highestBidder.email}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.disabled">No Bids Yet</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" display="block">Start: {row.startTime ? row.startTime.replace('T', ' ') : 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary">End: {row.endTime ? row.endTime.replace('T', ' ') : 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      color={getStatusColor(row.status)}
                      icon={row.status === 'Live' ? <PlayCircleFilledIcon /> : undefined}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {/* ⚡ SET LIVE button (only for Upcoming) */}
                    {row.status === 'Upcoming' && (
                      <Tooltip title="Set Live Now">
                        <IconButton
                          color="error"
                          onClick={() => handleSetLive(row)}
                          sx={{ mr: 1 }}
                        >
                          <PlayCircleFilledIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* 🏁 END AUCTION button (only for Live) */}
                    {row.status === 'Live' && (
                      <Tooltip title="End & Archive">
                        <IconButton
                          color="warning"
                          onClick={() => handleSetEnded(row)}
                          sx={{ mr: 1 }}
                        >
                          <GavelIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleEdit(row)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(row._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateAuction
        open={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
          fetchAuctions();
        }}
        auctionData={selectedAuctionToEdit}
      />
    </Box>
  );
};

export default ManageAuctions;

