import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Autocomplete, Box, Typography, Avatar, CircularProgress, Alert
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = "http://localhost:5000";

const CreateAuction = ({ open, onClose, auctionData }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState("");

  // ✅ Smart default times
  const getDefaultStartTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 5); // 5 minutes ago = immediately Live
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  };

  const getDefaultEndTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 2); // 2 hours from now
    return now.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    startPrice: '',
    startTime: getDefaultStartTime(),
    endTime: getDefaultEndTime()
  });

  // ✅ Load Products
  useEffect(() => {
    if (!open) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/products`);
        setProducts(data);
        setError("");
      } catch (err) {
        setError("❌ Failed to load products from server");
      }
      setLoading(false);
    };

    fetchProducts();

    // ✅ EDIT MODE
    if (auctionData) {
      setFormData({
        startPrice: auctionData.basePrice,
        startTime: auctionData.startTime,
        endTime: auctionData.endTime
      });

      setSelectedProduct({
        _id: auctionData.productId,
        name: auctionData.productName,
        image: auctionData.productImage,
        price: auctionData.basePrice,
        category: auctionData.category
      });
    } else {
      setFormData({ startPrice: '', startTime: '', endTime: '' });
      setSelectedProduct(null);
    }

  }, [open, auctionData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ SUBMIT TO DATABASE
  const handleSubmit = async () => {
    if (!selectedProduct || !formData.startPrice || !formData.startTime || !formData.endTime) {
      alert("⚠️ Fill all fields!");
      return;
    }

    // ✅ Validate: End time must be after start time
    const startDate = new Date(formData.startTime);
    const endDate = new Date(formData.endTime);

    if (endDate <= startDate) {
      alert("⚠️ End time must be AFTER start time!\n\nCurrent:\nStart: " + formData.startTime + "\nEnd: " + formData.endTime);
      return;
    }

    const payload = {
      productId: selectedProduct._id,
      productName: selectedProduct.name,
      productImage: selectedProduct.image,
      category: selectedProduct.category,
      basePrice: Number(formData.startPrice),
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: 'Upcoming'
    };

    try {
      if (auctionData) {
        await axios.put(`${API_BASE_URL}/api/auctions/${auctionData._id}`, payload);
        alert("✅ Auction Updated Successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/auctions`, payload);
        alert("✅ New Auction Created Successfully!");
      }
      onClose();
    } catch (err) {
      console.error("Auction Save Error:", err);
      alert("❌ Failed to save auction!");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/logos/coin_hero.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {auctionData ? "✏️ Edit Auction" : "🚀 Create New Auction"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Autocomplete
              options={products}
              loading={loading}
              value={selectedProduct}
              getOptionLabel={(option) => option.name || ""}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              onChange={(event, newValue) => {
                setSelectedProduct(newValue);
                if (newValue) {
                  setFormData(prev => ({ ...prev, startPrice: newValue.price }));
                }
              }}
              disabled={!!auctionData}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: 'flex', gap: 2 }}>
                  <Avatar src={getImageUrl(option.image)} variant="rounded" />
                  <Box>
                    <Typography fontWeight="bold">{option.name}</Typography>
                    <Typography variant="caption">{option.category}</Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Select Product" />
              )}
            />
          </Grid>

          {selectedProduct && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2, display: 'flex', gap: 2 }}>
                <img
                  src={getImageUrl(selectedProduct.image)}
                  alt={selectedProduct.name}
                  style={{ width: 80, height: 80 }}
                />
                <Box>
                  <Typography fontWeight="bold">{selectedProduct.name}</Typography>
                  <Typography>৳{selectedProduct.price}</Typography>
                </Box>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              label="Starting Price"
              name="startPrice"
              type="number"
              fullWidth
              value={formData.startPrice}
              onChange={handleChange}
            />
          </Grid>

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

      <DialogActions>
        <Button onClick={onClose} color="error">Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {auctionData ? "Update Auction" : "Create Auction"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAuction;
