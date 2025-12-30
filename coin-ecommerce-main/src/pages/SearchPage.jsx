import React, { useState, useEffect } from 'react';
import { Box, Container, TextField, Typography, Grid, CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API_BASE_URL = "http://localhost:5000";

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]); // ডাটাবেসের সব ডাটা
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();

  // ১. পেজ লোড হলে ডাটাবেস থেকে সব প্রোডাক্ট আনবে
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/products`);
        setAllProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading products for search:", error);
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // ২. URL বা ইনপুট পরিবর্তন হলে ফিল্টার করবে
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setQuery(q);
    
    if (q && allProducts.length > 0) {
      performSearch(q);
    } else {
      setResults([]);
    }
  }, [location.search, allProducts]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    performSearch(val);
  };

  const performSearch = (searchText) => {
    const t = searchText.toLowerCase();
    if (!t) {
      setResults([]);
      return;
    }

    // লাইভ ডাটার উপর ফিল্টার
    const filtered = allProducts.filter(item => {
        const nameMatch = item.name && item.name.toLowerCase().includes(t);
        const catMatch = item.category && item.category.toLowerCase().includes(t);
        return nameMatch || catMatch;
    });

    setResults(filtered);
  };

  return (
    <Box sx={{ minHeight: '80vh', py: 5, backgroundColor: '#f4f9f4' }}>
      <Container maxWidth="lg">
        
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1b5e20', fontWeight: 'bold' }}>
          Search Historical Coins
        </Typography>

        {/* সার্চ বক্স */}
        <Container maxWidth="md" sx={{ mb: 5 }}>
            <TextField
              fullWidth
              label="Search coins (e.g. taka, mughal)..."
              variant="outlined"
              value={query}
              onChange={handleSearch}
              sx={{ backgroundColor: 'white' }}
            />
        </Container>

        {/* রেজাল্ট সেকশন */}
        {loading ? (
            <Box sx={{ textAlign: 'center' }}><CircularProgress /></Box>
        ) : (
            <>
                {results.length > 0 ? (
                  <Grid container spacing={3}>
                    {results.map((product) => (
                      <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                        {/* ডাইনামিক ডাটা কার্ডে পাঠানো হচ্ছে */}
                        <ProductCard product={product} /> 
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  query && (
                    <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 4 }}>
                      No coins found matching "{query}"
                    </Typography>
                  )
                )}
            </>
        )}
      </Container>
    </Box>
  );
};

export default SearchPage;