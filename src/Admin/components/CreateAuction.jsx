import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Grid, Autocomplete, Box, Typography, Avatar, CircularProgress, Alert
} from '@mui/material';
import axios from 'axios';

// API URL (আপনার ব্যাকএন্ড পোর্ট)
const API_BASE_URL = "http://localhost:5000";

const CreateAuction = ({ open, onClose, auctionData }) => { 
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    startPrice: '',
    startTime: '',
    endTime: ''
  });

  // ✅ ১. প্রোডাক্ট লোড করা
  useEffect(() => {
    if (open) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/products`);
          setProducts(data); 
          setError("");
        } catch (err) {
          console.error("Error fetching products:", err);
          setError("Failed to load products via API.");
        }
        setLoading(false);
      };
      fetchProducts();

      // এডিট মোড হ্যান্ডলিং
      if (auctionData) {
        setFormData({
          startPrice: auctionData.basePrice,
          startTime: auctionData.startTime,
          endTime: auctionData.endTime
        });
        
        setSelectedProduct({
          _id: auctionData._id, 
          name: auctionData.productName,
          image: auctionData.image,
          price: auctionData.basePrice,
          category: "Existing Auction Item"
        });
      } else {
        setFormData({ startPrice: '', startTime: '', endTime: '' });
        setSelectedProduct(null);
      }
    }
  }, [open, auctionData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // সাবমিট হ্যান্ডলার
  const handleSubmit = async () => {
    if (!selectedProduct || !formData.startPrice || !formData.startTime || !formData.endTime) {
      alert("⚠️ Please fill all fields correctly (Product, Price, Date & Time).");
      return;
    }

    const payload = {
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
        console.log("Updating Auction:", payload);
        alert(`✅ Auction Updated Successfully for: ${selectedProduct.name}`);
      } else {
        console.log("Creating New Auction:", payload);
        alert(`✅ New Auction Created for: ${selectedProduct.name}`);
      }
      onClose();
    } catch (err) {
      console.error("Error submitting auction:", err);
      alert("❌ Operation Failed. Please try again.");
    }
  };

  // ✅ ইমেজ রেন্ডারিং হেল্পার ফাংশন
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/logos/coin_hero.jpg"; // একদম ছবি না থাকলে ডিফল্ট
    if (imagePath.startsWith("http")) return imagePath;   // যদি অনলাইন লিংক হয়
    return `${API_BASE_URL}${imagePath}`;               // যদি লোকাল পাথ হয় (/assets/...)
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', color: auctionData ? '#1565c0' : '#1b5e20', borderBottom: '1px solid #eee' }}>
        {auctionData ? "✏️ Edit Auction Details" : "🚀 Start New Auction"}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          
          {/* ✅ ২. প্রোডাক্ট সার্চ (Autocomplete) */}
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
                  setFormData((prev) => ({ ...prev, startPrice: newValue.price }));
                }
              }}
              
              disabled={!!auctionData} 
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src={getImageUrl(option.image)} // ✅ ফিক্সড ইমেজ ফাংশন ব্যবহার
                    variant="rounded" 
                  />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{option.category}</Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Search Product from Database" 
                  variant="outlined" 
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* ✅ ৩. প্রিভিউ সেকশন (ইমেজ ফিক্স) */}
          {selectedProduct && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <img 
                  src={getImageUrl(selectedProduct.image)} // ✅ ফিক্সড ইমেজ ফাংশন ব্যবহার
                  alt={selectedProduct.name} 
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff' }} 
                  onError={(e) => e.target.src = "/assets/logos/coin_hero.jpg"} // ফলব্যাক
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">{selectedProduct.name}</Typography>
                  <Typography variant="body2">Valuation: ৳{selectedProduct.price}</Typography>
                </Box>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              label="Starting Bid (৳)"
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
              helperText="Select Date & Time"
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
              helperText="Select Date & Time"
            />
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="error">Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color={auctionData ? "info" : "primary"}
        >
          {auctionData ? "Update Auction" : "Create Auction"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAuction;