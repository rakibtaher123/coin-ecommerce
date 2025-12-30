import React from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Chip 
} from '@mui/material';

const AuctionHistory = () => {
  // ডামি আর্কাইভ ডেটা
  const history = [
    { id: 101, name: "British India 1 Rupee", winner: "Rakib Taher", soldPrice: 15000, date: "05 Dec 2025" },
    { id: 102, name: "Sultanate Silver Coin", winner: "Hasan", soldPrice: 22000, date: "01 Dec 2025" },
    { id: 103, name: "Ancient Punch Marked", winner: "N/A (Unsold)", soldPrice: 0, date: "28 Nov 2025" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
        Auction Archive & History
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#eeeeee' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Auction ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Winning Bidder</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Sold Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((row) => (
              <TableRow key={row.id}>
                <TableCell>#{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.winner}</TableCell>
                <TableCell>
                  {row.soldPrice > 0 ? `৳${row.soldPrice.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.soldPrice > 0 ? "Sold" : "Unsold"} 
                    color={row.soldPrice > 0 ? "success" : "default"} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AuctionHistory;