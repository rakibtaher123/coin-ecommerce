import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Autocomplete, Box, Typography,
  CircularProgress, Divider, InputAdornment, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import axios from 'axios';
import { Gavel, Image, Label, AccessTime, Category } from '@mui/icons-material';

const API_BASE_URL = "https://gangaridai-auction.onrender.com";

const CATEGORIES = ["Gold", "Silver", "Ancient", "Mughal", "British India", "Republic India", "Foreign", "Notes", "Medals", "Tokens"];

const CreateAuction = ({ open, onClose, auctionData }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    lotNumber: '',
    category: '', // Explicit Category Field
    startPrice: '',
    minEstimate: '',
    maxEstimate: '',
    incrementAmount: '100',
    startTime: '',
    endTime: ''
  });

  // ✅ Smart Default Times (Local Time for Input)
  const getLocalISOString = (addHours = 0) => {
    const now = new Date();
    now.setHours(now.getHours() + addHours);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (!open) return;

    // 1. Fetch Products
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/products`);
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchProducts();

    // 2. Initialize Form
    if (auctionData) {
      setFormData({
        lotNumber: auctionData.lotNumber || '',
        category: auctionData.category || '',
        startPrice: auctionData.basePrice || '',
        minEstimate: auctionData.minEstimate || '',
        maxEstimate: auctionData.maxEstimate || '',
        incrementAmount: auctionData.incrementAmount || '100',
        startTime: auctionData.startTime ? new Date(auctionData.startTime).toISOString().slice(0, 16) : '',
        endTime: auctionData.endTime ? new Date(auctionData.endTime).toISOString().slice(0, 16) : ''
      });
      setSelectedProduct({
        _id: auctionData.productId,
        name: auctionData.productName,
        image: auctionData.productImage,
        category: auctionData.category
      });
    } else {
      setFormData({
        lotNumber: `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
        category: '',
        startPrice: '',
        minEstimate: '',
        maxEstimate: '',
        incrementAmount: '100',
        startTime: getLocalISOString(0),
        endTime: getLocalISOString(48)
      });
      setSelectedProduct(null);
    }
  }, [open, auctionData]);

  // ✅ Handle Product Selection & Auto-fill
  const handleProductSelect = (event, newValue) => {
    setSelectedProduct(newValue);
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        category: newValue.category || prev.category, // Auto-fill category
        startPrice: newValue.price || '',
        minEstimate: newValue.price || '',
        maxEstimate: newValue.price ? Math.ceil(newValue.price * 1.5) : '',
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !formData.startPrice || !formData.startTime || !formData.endTime) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    setLoading(true);

    const payload = {
      productId: selectedProduct._id,
      productName: selectedProduct.name,
      productImage: selectedProduct.image,

      // Form Fields
      category: formData.category,
      lotNumber: formData.lotNumber,
      minEstimate: Number(formData.minEstimate),
      maxEstimate: Number(formData.maxEstimate),
      incrementAmount: Number(formData.incrementAmount),
      startingPrice: Number(formData.startPrice),
      basePrice: Number(formData.startPrice),

      // Times (Converted to ISO)
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      status: 'Upcoming'
    };

    try {
      if (auctionData) {
        await axios.put(`${API_BASE_URL}/api/auctions/${auctionData._id}`, payload);
        alert("✅ Auction Updated Successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/auctions`, payload);
        alert("✅ Auction Created Successfully!");
      }
      onClose();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || err.message || "Unknown error";
      alert(`❌ Failed to save auction: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ bgcolor: '#1a237e', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Gavel />
        {auctionData ? "Edit Auction Lot" : "Create Professional Auction Lot"}
      </DialogTitle>

      <DialogContent sx={{ mt: 2, p: 4 }}>
        <Grid container spacing={4}>
          {/* LEFT COLUMN: Form Inputs */}
          <Grid item xs={12} md={7}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Label /> Lot Details
            </Typography>

            <Grid container spacing={2}>
              {/* Lot Number */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Lot Number"
                  name="lotNumber"
                  value={formData.lotNumber}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              {/* Category Dropdown */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleChange}
                  >
                    {CATEGORIES.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Estimates */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Min Estimate (Low)"
                  name="minEstimate"
                  type="number"
                  value={formData.minEstimate}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start">৳</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Max Estimate (High)"
                  name="maxEstimate"
                  type="number"
                  value={formData.maxEstimate}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start">৳</InputAdornment> }}
                />
              </Grid>

              {/* Pricing */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Starting Price"
                  name="startPrice"
                  type="number"
                  value={formData.startPrice}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start">৳</InputAdornment> }}
                  sx={{ bgcolor: '#e8f5e9' }} // Light green to highlight importance
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Bid Increment"
                  name="incrementAmount"
                  type="number"
                  value={formData.incrementAmount}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start">+</InputAdornment> }}
                />
              </Grid>

              {/* Schedule */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="caption" color="text.secondary">SCHEDULE</Typography>
                </Divider>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* RIGHT COLUMN: Product Preview */}
          <Grid item xs={12} md={5}>
            <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 2, height: '100%', border: '1px dashed #bdbdbd' }}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Image /> Select Product
              </Typography>

              <Autocomplete
                options={products}
                getOptionLabel={(option) => option.name}
                value={selectedProduct}
                onChange={handleProductSelect}
                renderInput={(params) => <TextField {...params} label="Search Inventory..." variant="outlined" fullWidth />}
                sx={{ mb: 3, bgcolor: 'white' }}
              />

              {selectedProduct ? (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <img
                    src={selectedProduct.image || selectedProduct.productImage}
                    alt={selectedProduct.name}
                    style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                    {selectedProduct.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {selectedProduct._id}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                  <Typography variant="body1">No Product Selected</Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
        <Button onClick={onClose} color="inherit" size="large">Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          startIcon={<Gavel />}
          sx={{ px: 4, py: 1 }}
        >
          {loading ? "Creating..." : "Create Auction Lot"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAuction;

