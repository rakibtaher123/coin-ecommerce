import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, Grid, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Avatar 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  
  // ফর্ম স্টেট
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null); // ফাইলের জন্য স্টেট
  const [preview, setPreview] = useState(''); // প্রিভিউ দেখানোর জন্য

  // প্রোডাক্ট লোড করা
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ফাইল সিলেক্ট হ্যান্ডলার
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
        setPreview(URL.createObjectURL(file)); // প্রিভিউ সেট করা
    }
  };

  // সাবমিট হ্যান্ডলার (FormData ব্যবহার করে)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // FormData অবজেক্ট তৈরি (ফাইল পাঠানোর জন্য এটি জরুরি)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('price', price);
    if (imageFile) {
        formData.append('image', imageFile); // 'image' নামটা ব্যাকএন্ডের সাথে মিলতে হবে
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        // headers এ 'Content-Type' দেওয়া যাবে না, ব্রাউজার অটো সেট করবে
        body: formData, 
      });

      if (response.ok) {
        alert("Product Added Successfully!");
        // ফর্ম রিসেট
        setName('');
        setCategory('');
        setPrice('');
        setImageFile(null);
        setPreview('');
        fetchProducts(); // লিস্ট রিফ্রেশ
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ডিলিট হ্যান্ডলার
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("Product Deleted!");
        fetchProducts(); // লিস্ট থেকে সরিয়ে দেওয়া
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Manage Products</Typography>

      <Grid container spacing={4}>
        {/* বাম পাশ: প্রোডাক্ট অ্যাড করার ফর্ম */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Add New Product</Typography>
            <form onSubmit={handleSubmit}>
              <TextField 
                fullWidth label="Product Name" variant="outlined" margin="normal" 
                value={name} onChange={(e) => setName(e.target.value)} required 
              />
              <TextField 
                fullWidth label="Category" variant="outlined" margin="normal" 
                value={category} onChange={(e) => setCategory(e.target.value)} required 
              />
              <TextField 
                fullWidth label="Price (Tk)" type="number" variant="outlined" margin="normal" 
                value={price} onChange={(e) => setPrice(e.target.value)} required 
              />
              
              {/* ইমেজ আপলোড বাটন */}
              <Box sx={{ mt: 2, mb: 2, border: '1px dashed #ccc', p: 2, textAlign: 'center' }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="raised-button-file">
                  <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                    Upload Image
                  </Button>
                </label>
                {preview && (
                    <Box mt={2}>
                        <img src={preview} alt="Preview" style={{ width: '100px', borderRadius: '8px' }} />
                    </Box>
                )}
              </Box>

              <Button type="submit" variant="contained" fullWidth color="success" size="large">
                Save Product
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* ডান পাশ: প্রোডাক্ট লিস্ট এবং ডিলিট বাটন */}
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#eee' }}>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Avatar 
                        src={`http://localhost:5000${product.image}`} 
                        variant="rounded" 
                        sx={{ width: 50, height: 50 }}
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>৳{product.price}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDelete(product._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageProducts;