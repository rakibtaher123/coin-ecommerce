import React from 'react';
import { Container, Typography } from '@mui/material';

const ArchivesPage = () => {
  return (
    <Container sx={{ py: 5, textAlign: 'center' }}>
      <Typography variant="h3" color="primary" fontWeight="bold" gutterBottom>
        🗄️ Auction Archives
      </Typography>
      <Typography variant="h6">
        View results of past auctions.
      </Typography>
      {/* এখানে আর্কাইভ কন্টেন্ট বসবে */}
    </Container>
  );
};

export default ArchivesPage;