import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Grid, Card, CardMedia, CardContent, Typography, Button,
    Box, FormControl, InputLabel, Select, MenuItem, TextField, Chip,
    AppBar, Toolbar, IconButton
} from '@mui/material';
import { ArrowBack, ShoppingCart, Search } from '@mui/icons-material';

const ClientProductsPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Categories matching your database
    const categories = [
        'All',
        'Janapada Series',
        'Ancient Bengal',
        'Medieval Bengal',
        'Sultanate Period',
        'Mughal Empire',
        'East India Company',
        'British Indian Coins',
        'British Indian Notes',
        'Pakistani Coins',
        'Pakistani Notes',
        'Bd Republic Coins',
        'Bd Republic Notes'
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setProducts(data);
            setFilteredProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = products;

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    }, [selectedCategory, searchQuery, products]);

    const handleAddToCart = (product) => {
        // Get existing cart
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Check if product already in cart
        const existingIndex = cart.findIndex(item => item._id === product._id);

        if (existingIndex >= 0) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`✅ ${product.name} added to cart!`);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* Header */}
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => navigate('/client')}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                        Browse Products
                    </Typography>
                    <IconButton color="inherit" onClick={() => navigate('/cart')}>
                        <ShoppingCart />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container sx={{ py: 4 }}>
                {/* Filters */}
                <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 250 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            label="Category"
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Search Products"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{ flexGrow: 1 }}
                    />
                </Box>

                {/* Results Count */}
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Showing {filteredProducts.length} products
                    {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                </Typography>

                {/* Products Grid */}
                {loading ? (
                    <Typography>Loading products...</Typography>
                ) : filteredProducts.length === 0 ? (
                    <Typography variant="h6" sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                        No products found
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {filteredProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`http://localhost:5000${product.image}`}
                                        alt={product.name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Chip
                                            label={product.category}
                                            size="small"
                                            sx={{ mb: 1, alignSelf: 'flex-start' }}
                                        />
                                        <Typography variant="h6" gutterBottom noWrap>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                                            ৳{product.price?.toLocaleString()}
                                        </Typography>
                                        {product.description && (
                                            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                                                {product.description.substring(0, 100)}...
                                            </Typography>
                                        )}
                                        <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                Add to Cart
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                onClick={() => navigate(`/product/${product._id}`)}
                                            >
                                                View
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default ClientProductsPage;
