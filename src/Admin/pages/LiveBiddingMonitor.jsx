import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, List, ListItem, 
  ListItemText, ListItemAvatar, Avatar, Button, Divider 
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import { useParams } from 'react-router-dom';

const LiveBiddingMonitor = () => {
  const { id } = useParams();
  
  // ডামি লাইভ বিড ডেটা
  const [bids, setBids] = useState([
    { id: 1, user: "Rakib", amount: 55000, time: "10:30:05 AM" },
    { id: 2, user: "Sakib", amount: 54000, time: "10:29:45 AM" },
    { id: 3, user: "Tanvir", amount: 52000, time: "10:28:10 AM" },
  ]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
        🔴 Live Bidding Monitor (Auction #{id})
      </Typography>

      <Grid container spacing={3}>
        
        {/* Left: Auction Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <img 
              src="/assets/mughal_empire/mughal_gold_mohur.jpg" 
              alt="Coin" 
              style={{ width: '80%', borderRadius: 10, marginBottom: 15 }} 
            />
            <Typography variant="h6" fontWeight="bold">Rare Mughal Gold Mohur</Typography>
            <Typography variant="h4" color="primary" sx={{ my: 2 }}>
              Current Bid: ৳55,000
            </Typography>
            <Button variant="contained" color="error" startIcon={<GavelIcon />}>
              Stop Auction
            </Button>
          </Paper>
        </Grid>

        {/* Right: Live Feed */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Live Bid Feed
            </Typography>
            <Divider />
            <List>
              {bids.map((bid) => (
                <ListItem key={bid.id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#1b5e20' }}>{bid.user[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {bid.user} placed a bid of ৳{bid.amount.toLocaleString()}
                      </Typography>
                    }
                    secondary={`Time: ${bid.time}`} 
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default LiveBiddingMonitor;