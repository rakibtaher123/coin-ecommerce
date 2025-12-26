import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, IconButton, Avatar, Button,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, Accordion, AccordionSummary, AccordionDetails, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState(10); // Default stock quantity
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  // Get admin token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
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
    return products.filter(p => p.category === category);
  };

  // Open add product dialog
  const handleOpenDialog = (category) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setName('');
    setPrice('');
    setStock(10);
    setDescription('');
    setImageFile(null);
    setPreview('');
    setSelectedCategory('');
  };

  // Handle image selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', selectedCategory);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("✅ Product Added Successfully!");
        handleCloseDialog();
        fetchProducts();
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to add product: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error adding product: " + error.message);
    }
  };

  // Delete product
  const handleDelete = async (id, productName) => {
    if (!window.confirm(`Delete "${productName}"?`)) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("✅ Product Deleted Successfully!");
        fetchProducts();
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to delete: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        📦 Manage Products by Category
      </Typography>

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
                      <Paper sx={{ p: 2, position: 'relative', '&:hover .delete-btn': { opacity: 1 } }}>
                        {/* Delete Button - More Prominent */}
                        <IconButton
                          className="delete-btn"
                          onClick={() => handleDelete(product._id, product.name)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: '#ff1744',
                            color: 'white',
                            opacity: 0.8,
                            zIndex: 10,
                            '&:hover': {
                              bgcolor: '#d50000',
                              opacity: 1,
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s'
                          }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>

                        {/* Product Image */}
                        <Avatar
                          src={product.image}
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

      {/* Add Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Product to: <strong>{selectedCategory}</strong>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddProduct} id="add-product-form">
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
              helperText="Product details like location, period, condition, etc."
              placeholder="Example: Location: Dhaka; Period: Ancient; Type: Silver; Condition: VF; Rarity: Rare"
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
                  Upload Image
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
            form="add-product-form"
            variant="contained"
            color="success"
          >
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageProducts;