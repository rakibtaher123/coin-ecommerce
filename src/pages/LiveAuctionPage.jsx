import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const LiveAuctionPage = () => {
  return (
    <Container sx={{ py: 5, textAlign: 'center' }}>
      <Typography variant="h3" color="error" fontWeight="bold" gutterBottom>
        🔴 LIVE AUCTION
      </Typography>
      <Typography variant="h6">
        Bid on exclusive coins in real-time! (Coming Soon)
      </Typography>
      {/* এখানে লাইভ অকশনের কন্টেন্ট বসবে */}
    </Container>
  );
};

export default LiveAuctionPage;