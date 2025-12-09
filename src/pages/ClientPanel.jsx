import React from 'react';
import { Box, Container, Typography, Paper, Grid, Button } from '@mui/material';

const ClientPanel = () => {
  return (
    <Box sx={{ py: 6, backgroundColor: '#f4f9f4', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ color: '#1b5e20', fontWeight: 'bold', mb: 3 }}>Client Panel</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Account Menu</Typography>
              <Box sx={{ mt: 2 }}>
                <Button fullWidth sx={{ mb: 1 }}>My Orders</Button>
                <Button fullWidth sx={{ mb: 1 }}>Profile</Button>
                <Button fullWidth sx={{ mb: 1 }}>Addresses</Button>
                <Button fullWidth sx={{ mb: 1 }}>Payment Methods</Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Welcome</Typography>
              <Typography variant="body2" color="text.secondary">This is the client dashboard where customers can view their orders, edit profile details, and manage saved addresses and payment methods.</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ClientPanel;
