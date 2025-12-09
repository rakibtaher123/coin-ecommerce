import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, IconButton, CircularProgress, Tooltip 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import axios from 'axios'; // API কলের জন্য

// কম্পোনেন্ট ইম্পোর্ট
import CreateAuction from '../components/CreateAuction';

// আপনার ব্যাকএন্ড পোর্ট (নিশ্চিত করুন এটি সঠিক)
const API_BASE_URL = "http://localhost:5000";

const ManageAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // মোডাল স্টেট
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedAuctionToEdit, setSelectedAuctionToEdit] = useState(null);

  // ✅ ১. ডাটাবেস থেকে রিয়েল ডাটা ফেচ করা
  const fetchAuctions = async () => {
    try {
      setLoading(true);
      // রিয়েল API কল (যদি ব্যাকএন্ড রেডি থাকে)
      const { data } = await axios.get(`${API_BASE_URL}/api/auctions`);
      setAuctions(data);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      // এরর হলে ডামি ডাটা দিয়ে চালানো (যাতে পেজ ফাঁকা না থাকে)
      const dummyAuctions = [
        {
          _id: 1,
          productName: "Rare Mughal Gold Mohur",
          image: "/assets/mughal_empire/mughal_gold_mohur.jpg", 
          basePrice: 50000,
          highestBid: 55000,
          startTime: "2025-12-10T10:00",
          endTime: "2025-12-12T22:00",
          status: "Live",
        },
        {
          _id: 2,
          productName: "Ancient Bengal Silver Tanka",
          image: "/assets/ancient_bengal/azam_shah_tanka.jpg",
          basePrice: 12000,
          highestBid: 12000,
          startTime: "2025-12-15T09:00",
          endTime: "2025-12-16T21:00",
          status: "Upcoming",
        }
      ];
      setAuctions(dummyAuctions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  // ✅ ২. ডিলিট লজিক
  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to delete this auction?")) {
      try {
        // await axios.delete(`${API_BASE_URL}/api/auctions/${id}`); // রিয়েল ডিলিট
        setAuctions(auctions.filter((auc) => auc._id !== id)); // লোকালে ডিলিট
        alert("✅ Auction deleted successfully!");
      } catch (error) {
        alert("❌ Failed to delete auction.");
      }
    }
  };

  // এডিট হ্যান্ডলার
  const handleEdit = (auction) => {
    setSelectedAuctionToEdit(auction);
    setOpenCreateModal(true);
  };

  // নতুন ক্রিয়েট হ্যান্ডলার
  const handleCreateNew = () => {
    setSelectedAuctionToEdit(null);
    setOpenCreateModal(true);
  };

  // ✅ ৩. ইমেজ ফিক্স লজিক (সবচেয়ে গুরুত্বপূর্ণ)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/logos/coin_hero.jpg"; // ডিফল্ট লোগো
    if (imagePath.startsWith("http")) return imagePath;   // অনলাইন লিংক হলে সরাসরি
    return `${API_BASE_URL}${imagePath}`;               // লোকাল হলে ব্যাকএন্ড URL যোগ
  };

  // স্ট্যাটাস কালার
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
              <TableCell><strong>Time</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center"><CircularProgress/></TableCell></TableRow>
            ) : auctions.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center">No auctions found.</TableCell></TableRow>
            ) : (
              auctions.map((row) => (
                <TableRow key={row._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* ✅ ফিক্সড ইমেজ ফাংশন ব্যবহার */}
                      <img 
                        src={getImageUrl(row.image)} 
                        alt={row.productName} 
                        onError={(e) => e.target.src = "/assets/logos/coin_hero.jpg"} // ফলব্যাক
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
                  <TableCell>৳{row.basePrice.toLocaleString()}</TableCell>
                  <TableCell sx={{ color: 'green', fontWeight: 'bold' }}>
                    ৳{row.highestBid ? row.highestBid.toLocaleString() : row.basePrice.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" display="block">Start: {row.startTime.replace('T', ' ')}</Typography>
                    <Typography variant="caption" color="text.secondary">End: {row.endTime.replace('T', ' ')}</Typography>
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

      {/* ✅ Create/Edit পপআপ কল */}
      <CreateAuction 
        open={openCreateModal} 
        onClose={() => {
          setOpenCreateModal(false);
          fetchAuctions(); // মডাল বন্ধ হলে লিস্ট রিফ্রেশ হবে
        }} 
        auctionData={selectedAuctionToEdit} 
      />
    </Box>
  );
};

export default ManageAuctions;