import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, IconButton, Avatar, Button,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, Accordion, AccordionSummary, AccordionDetails, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// 12 Categories - EXACT names matching database
const CATEGORIES = [
  "Janapada Series",
  "Ancient Bengal",
  "Medieval Bengal",
  "Sultanate Period",
  "Mughal Empire",
  "East India Company",
  "British Indian Coins",
  "British Indian Notes",
  "Pakistani Coins",
  "Pakistani Notes",
  "Bd Republic Coins",
  "Bd Republic Notes"
];

const API_BASE_URL = "https://gangaridai-auction.onrender.com";

const getFullImageUrl = (imagePath) => {
  if (imagePath && !imagePath.startsWith('http')) {
    const pathWithSlash = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_BASE_URL}${pathWithSlash}`;
  }
  return imagePath;
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Edit Mode States
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState(10);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  // ✅ ফিক্স ১: টোকেন পাওয়ার জন্য হেল্পার ফাংশন
  const getToken = () => {
    // পদ্ধতি ১: সরাসরি 'token' নামে লোকাল স্টোরেজে আছে কিনা চেক করি
    let token = localStorage.getItem('token');

    // পদ্ধতি ২: যদি না থাকে, তবে 'userInfo' এর ভেতরে চেক করি (MERN প্রজেক্টে সচরাচর যা থাকে)
    if (!token) {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          token = parsedUser.token;
        } catch (error) {
          console.error("Token parsing error:", error);
        }
      }
    }
    return token;
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Group products by category
  const getProductsByCategory = (category) => {
    return products.filter(p => p.category?.trim().toLowerCase() === category.trim().toLowerCase());
  };

  // Open add product dialog
  const handleOpenDialog = (category) => {
    setIsEditMode(false);
    setEditProductId(null);
    setSelectedCategory(category);

    setName('');
    setPrice('');
    setStock(10);
    setDescription('');
    setImageFile(null);
    setPreview('');
    setOpenDialog(true);
  };

  // Open Edit Dialog
  const handleEditClick = (product) => {
    setIsEditMode(true);
    setEditProductId(product._id);
    setSelectedCategory(product.category);

    setName(product.name);
    setPrice(product.price);
    setStock(product.countInStock || 0);
    setDescription(product.description || '');
    setPreview(product.image);
    setImageFile(null);

    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditMode(false);
    setEditProductId(null);
  };

  // Handle image selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ ফিক্স ২: হ্যান্ডেল সাবমিট ফাংশনে টোকেন যোগ করা হয়েছে
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', selectedCategory);
    formData.append('price', price);
    formData.append('countInStock', stock);
    formData.append('description', description);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const url = isEditMode ? `${API_BASE_URL}/api/products/${editProductId}` : `${API_BASE_URL}/api/products`;
    const method = isEditMode ? 'PUT' : 'POST';

    // টোকেন নিয়ে আসা
    const token = getToken();

    if (!token) {
      alert("⚠️ You are not logged in or token expired! Please logout and login again.");
      return;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}` // <--- এই লাইনটিই আসল সমাধান
        },
        body: formData,
      });

      if (response.ok) {
        alert(isEditMode ? "✅ Product Updated Successfully!" : "✅ Product Added Successfully!");
        handleCloseDialog();
        fetchProducts();
      } else {
        const text = await response.text();
        // এরর সুন্দরভাবে দেখানোর চেষ্টা
        try {
          const errorObj = JSON.parse(text);
          alert(`❌ Failed: ${errorObj.message || errorObj.error}`);
        } catch {
          alert(`❌ Failed: ${text}`);
        }
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error: " + error.message);
    }
  };

  // ✅ ফিক্স ৩: ডিলিট ফাংশনেও টোকেন যোগ করা হয়েছে (নিরাপদ থাকার জন্য)
  const handleDelete = async (id, productName) => {
    if (!window.confirm(`Delete "${productName}"?`)) return;

    const token = getToken(); // টোকেন আনা

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // টোকেন পাঠানো
        }
      });

      if (response.ok) {
        alert("✅ Product Deleted Successfully!");
        fetchProducts();
      } else {
        const text = await response.text();
        alert(`❌ Failed to delete: ${text}`);
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        📦 Manage Products by Category
      </Typography>

      {/* DEBUG SECTION - REMOVE LATER */}
      <Box sx={{ p: 2, mb: 4, bgcolor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: 2 }}>
        <Typography variant="h6" color="warning.main">🚧 Debug Info</Typography>
        <Typography><strong>Total Products Fetched:</strong> {products.length}</Typography>
        <Typography><strong>Categories found in DB:</strong> {Array.from(new Set(products.map(p => p.category))).join(', ') || "None"}</Typography>
      </Box>

      {/* Category Accordions */}
      {CATEGORIES.map((category, index) => {
        const categoryProducts = getProductsByCategory(category);

        return (
          <Accordion key={index} sx={{ mb: 2, boxShadow: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#1976d2',
                color: 'white',
                '&:hover': { bgcolor: '#1565c0' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
                  {category}
                </Typography>
                <Chip
                  label={`${categoryProducts.length} products`}
                  sx={{ bgcolor: 'white', color: '#1976d2', fontWeight: 'bold' }}
                />
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 3, bgcolor: '#fafafa' }}>
              {/* Add Product Button */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog(category)}
                sx={{ mb: 3 }}
              >
                Add Product to {category}
              </Button>

              {/* Products Grid */}
              {categoryProducts.length > 0 ? (
                <Grid container spacing={2}>
                  {categoryProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                      <Paper sx={{ p: 2, position: 'relative', '&:hover .action-btn': { opacity: 1 } }}>

                        {/* Edit Button */}
                        <IconButton
                          className="action-btn"
                          onClick={() => handleEditClick(product)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 45,
                            bgcolor: '#1976d2',
                            color: 'white',
                            opacity: 0.8,
                            zIndex: 10,
                            '&:hover': { bgcolor: '#115293', opacity: 1 },
                            transition: 'all 0.2s'
                          }}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        {/* Delete Button */}
                        <IconButton
                          className="action-btn"
                          onClick={() => handleDelete(product._id, product.name)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: '#ff1744',
                            color: 'white',
                            opacity: 0.8,
                            zIndex: 10,
                            '&:hover': { bgcolor: '#d50000', opacity: 1 },
                            transition: 'all 0.2s'
                          }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>

                        {/* Product Image */}
                        <Avatar
                          src={getFullImageUrl(product.image)}
                          variant="rounded"
                          sx={{ width: '100%', height: 120, mb: 2 }}
                        />

                        {/* Product Info */}
                        <Typography variant="body1" fontWeight="bold" noWrap>
                          {product.name}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          ৳{product.price.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Stock: {product.countInStock || 0}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No products in this category yet. Click "Add Product" to create one.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Add/Edit Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditMode ? 'Edit Product' : `Add Product to: ${selectedCategory}`}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="product-form">
            <TextField
              fullWidth
              label="Product Name"
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Price (৳)"
              type="number"
              variant="outlined"
              margin="normal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Stock Quantity"
              type="number"
              variant="outlined"
              margin="normal"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              helperText="How many items available in stock"
              required
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              variant="outlined"
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Condition, Rarity, etc."
            />

            {/* Image Upload */}
            <Box sx={{ mt: 2, mb: 2, border: '1px dashed #ccc', p: 2, textAlign: 'center' }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="product-image-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="product-image-upload">
                <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                  {isEditMode ? "Change Image" : "Upload Image"}
                </Button>
              </label>
              {preview && (
                <Box mt={2}>
                  <img src={preview} alt="Preview" style={{ width: '150px', borderRadius: '8px' }} />
                </Box>
              )}
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            type="submit"
            form="product-form"
            variant="contained"
            color={isEditMode ? "primary" : "success"}
          >
            {isEditMode ? "Update Product" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageProducts;
