import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, Alert } from '@mui/material';

// --- FAKE TRACKING LOGIC ---
const trackOrder = (orderId) => {
  // Simulate an API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple logic to return different statuses based on the last digit of the Order ID
      const idNumber = parseInt(orderId.replace(/[^0-9]/g, ''));
      
      if (!orderId || isNaN(idNumber)) {
        resolve({ status: 'error', message: 'অনুগ্রহ করে সঠিক অর্ডার আইডি দিন।' });
      } else if (idNumber % 3 === 0) {
        resolve({ status: 'Delivered', message: `অর্ডার ID: ${orderId} সফলভাবে ডেলিভারি করা হয়েছে।` });
      } else if (idNumber % 3 === 1) {
        resolve({ status: 'Shipped', message: `অর্ডার ID: ${orderId} শিপিং করা হয়েছে এবং ট্রানজিটে আছে।` });
      } else {
        resolve({ status: 'Processing', message: `অর্ডার ID: ${orderId} বর্তমানে প্রক্রিয়াকরণের (Processing) অধীনে আছে।` });
      }
    }, 1000); // 1 second delay
  });
};
// ----------------------------

function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [trackingStatus, setTrackingStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async () => {
    setIsLoading(true);
    setTrackingStatus(null); 

    const result = await trackOrder(orderId);
    setTrackingStatus(result);
    setIsLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Track Your Order 🚚
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            আপনার অর্ডার নিশ্চিতকরণ ইমেল থেকে Order ID দিন।
          </Typography>

          {/* Order ID Input Field */}
          <TextField
            label="Order ID"
            variant="outlined"
            fullWidth
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            sx={{ mb: 3 }}
            disabled={isLoading}
          />

          {/* TRACK Button */}
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleTrack}
            disabled={isLoading || orderId.trim() === ''}
            sx={{ py: 1.5 }}
          >
            {isLoading ? 'ট্র্যাক হচ্ছে...' : 'TRACK'}
          </Button>

          {/* Tracking Status Display */}
          {trackingStatus && (
            <Box sx={{ mt: 3 }}>
              {trackingStatus.status === 'error' ? (
                <Alert severity="error">{trackingStatus.message}</Alert>
              ) : (
                <Alert severity="info">
                  <Typography variant="h6" gutterBottom>
                    স্ট্যাটাস: **{trackingStatus.status}**
                  </Typography>
                  <Typography>{trackingStatus.message}</Typography>
                </Alert>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default OrderTrackingPage;