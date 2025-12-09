import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  IconButton, 
  Avatar 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

// ডামি ডেটা (পরে এটি ডাটাবেস থেকে আসবে)
const initialAuctions = [
  {
    id: 1,
    name: "Rare Mughal Gold Mohur",
    image: "/assets/mughal_empire/mughal_gold_mohur.jpg", // আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী পাথ
    startPrice: 50000,
    currentBid: 55000,
    startTime: "2025-12-10 10:00 AM",
    endTime: "2025-12-12 10:00 PM",
    status: "Live", // Live, Upcoming, Ended
  },
  {
    id: 2,
    name: "Ancient Bengal Silver Tanka",
    image: "/assets/ancient_bengal/azam_shah_tanka.jpg",
    startPrice: 12000,
    currentBid: 12000,
    startTime: "2025-12-15 09:00 AM",
    endTime: "2025-12-16 09:00 PM",
    status: "Upcoming",
  },
  {
    id: 3,
    name: "British India 1 Rupee 1917",
    image: "/assets/british_indian_notes/bi_note_1_rupee_1917.jpg",
    startPrice: 8000,
    currentBid: 10500,
    startTime: "2025-12-01 10:00 AM",
    endTime: "2025-12-03 10:00 PM",
    status: "Ended",
  },
];

const ManageAuctions = () => {
  const [auctions, setAuctions] = useState(initialAuctions);

  // স্ট্যাটাস অনুযায়ী কালার সেট করার ফাংশন
  const getStatusColor = (status) => {
    switch (status) {
      case 'Live': return 'error';     // লাল
      case 'Upcoming': return 'warning'; // হলুদ/কমলা
      case 'Ended': return 'default';    // ধূসর
      default: return 'primary';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* হেডার সেকশন */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
          Manage Auctions
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          sx={{ fontWeight: 'bold' }}
        >
          Create New Auction
        </Button>
      </Box>

      {/* অকশন টেবিল */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Base Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Highest Bid</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Time Duration</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auctions.map((row) => (
              <TableRow key={row.id} hover>
                
                {/* প্রোডাক্ট ইনফো */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      src={row.image} 
                      alt={row.name} 
                      variant="rounded" 
                      sx={{ width: 50, height: 50 }} 
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {row.name}
                    </Typography>
                  </Box>
                </TableCell>

                {/* দাম */}
                <TableCell>৳{row.startPrice.toLocaleString()}</TableCell>
                <TableCell sx={{ color: 'green', fontWeight: 'bold' }}>
                  ৳{row.currentBid.toLocaleString()}
                </TableCell>

                {/* সময় */}
                <TableCell>
                  <Typography variant="caption" display="block">Start: {row.startTime}</Typography>
                  <Typography variant="caption" color="text.secondary">End: {row.endTime}</Typography>
                </TableCell>

                {/* স্ট্যাটাস চিপ */}
                <TableCell>
                  <Chip 
                    label={row.status} 
                    color={getStatusColor(row.status)} 
                    size="small" 
                    icon={row.status === 'Live' ? <PlayCircleFilledIcon /> : undefined}
                  />
                </TableCell>

                {/* অ্যাকশন বাটন */}
                <TableCell align="center">
                  <IconButton color="primary" title="Edit">
                    <EditIcon />
                  </IconButton>
                  
                  {row.status === 'Live' && (
                    <IconButton color="warning" title="Stop Auction">
                      <StopCircleIcon />
                    </IconButton>
                  )}

                  <IconButton color="error" title="Delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageAuctions;