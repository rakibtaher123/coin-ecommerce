import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, MenuItem, Grid 
} from '@mui/material';

// ডামি প্রোডাক্ট লিস্ট (পরে ডাটাবেস থেকে আসবে)
const products = [
  { id: 'p1', name: 'Mughal Gold Mohur' },
  { id: 'p2', name: 'British India 1 Rupee' },
  { id: 'p3', name: 'Ancient Bengal Silver Tanka' },
];

const CreateAuction = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    productId: '',
    startPrice: '',
    startTime: '',
    endTime: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("New Auction Data:", formData);
    alert("New Auction Created Successfully!");
    onClose(); // ফর্ম বন্ধ করা
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
        Create New Auction
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          
          {/* Product Selection */}
          <Grid item xs={12}>
            <TextField
              select
              label="Select Product"
              name="productId"
              fullWidth
              value={formData.productId}
              onChange={handleChange}
              variant="outlined"
            >
              {products.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Starting Price */}
          <Grid item xs={12}>
            <TextField
              label="Starting Bid Price (৳)"
              name="startPrice"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.startPrice}
              onChange={handleChange}
            />
          </Grid>

          {/* Start Time */}
          <Grid item xs={6}>
            <TextField
              label="Start Time"
              name="startTime"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.startTime}
              onChange={handleChange}
            />
          </Grid>

          {/* End Time */}
          <Grid item xs={6}>
            <TextField
              label="End Time"
              name="endTime"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.endTime}
              onChange={handleChange}
            />
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="error">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create Auction
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAuction;