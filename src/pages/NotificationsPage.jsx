import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';

function NotificationsPage() {
  return (
    <Container maxWidth="md">
      <Paper sx={{ padding: '32px', marginY: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Notifications
        </Typography>
        
        <Box sx={{ padding: '20px', border: '1px solid #eee', borderRadius: '4px', mt: 3 }}>
          <Typography variant="h6">Welcome!</Typography>
          <Typography color="text.secondary">You have 2 new notifications.</Typography>
        </Box>

        <Box sx={{ padding: '20px', border: '1px solid #eee', borderRadius: '4px', mt: 2 }}>
          <Typography variant="h6">Order Shipped!</Typography>
          <Typography color="text.secondary">Your order #1234 (Ancient Gold Coin) has been shipped.</Typography>
        </Box>

      </Paper>
    </Container>
  );
}

export default NotificationsPage;