import React from 'react';
import { Box, Container, Grid, Card, CardMedia, Typography, CircularProgress, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext'; 

// ✅ নতুন ফাংশন: Image URL ফিক্স (এটি ব্রাউজারকে সম্পূর্ণ URL দেয়)
const getFullImageUrl = (imagePath) => {
    // যদি imagePath থাকে এবং এটি 'http' বা 'https' দিয়ে শুরু না হয়
    if (imagePath && !imagePath.startsWith('http')) {
        return `http://localhost:5000${imagePath}`; // Backend URL যোগ করা হলো
    }
    return imagePath; // অন্যথায় (যেমন Placeholder বা সম্পূর্ণ URL) সেটি রিটার্ন করবে
};


const AllProductsPage = () => {
    const navigate = useNavigate();
    const { products, loading, error } = useProducts();

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading Coins...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h6" color="error">Error: {error}</Typography>
                <Typography variant="body2">Please make sure the Server (Backend) is running on port 5000.</Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ py: 6, backgroundColor: '#f6fbf6', minHeight: '80vh' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#1b5e20' }}>
                    Complete Coin Collection ({products.length} items)
                </Typography>
                
                {products.length === 0 ? (
                    <Box sx={{ textAlign: 'center', mt: 5 }}>
                        <Typography variant="h6" color="text.secondary">No products found.</Typography>
                        <Typography variant="body2">Database might be empty. Try running 'node seed.js' in server.</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                                <Card 
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 6 } }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        // ✅ পরিবর্তন: getFullImageUrl ফাংশনটি এখানে ব্যবহার করা হয়েছে
                                        image={getFullImageUrl(product.image)} 
                                        alt={product.name}
                                        sx={{ objectFit: 'contain', bgcolor: '#fff', p: 1 }}
                                        // ছবি লোড না হলে Placeholder দেখাবে
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" noWrap fontWeight="bold">{product.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{product.category}</Typography>
                                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>৳{product.price}</Typography>
                                        
                                        <Typography variant="caption" sx={{ color: product.countInStock > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                                            {product.countInStock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                                        </Typography>
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

export default AllProductsPage;