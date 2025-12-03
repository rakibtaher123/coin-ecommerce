import React, { useState, useEffect } from 'react';
import { Box, Container, TextField, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import coinData from '../dataWithMeta'; // enriched data with year/details

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // handler for the onChange of the local search input
  const handleSearch = (e) => {
    const val = e.target.value || '';
    // update results as user types
    performSearch(val);
  };

  // function to perform the search given a text
  const performSearch = (searchText) => {
    const t = (searchText || '').toLowerCase();
    setQuery(searchText || '');

    if (!t) {
      setResults([]);
      return;
    }

    const foundItems = [];
    Object.keys(coinData).forEach((category) => {
      const items = coinData[category];
      items.forEach((item) => {
        const name = (item && item.name) ? item.name.toLowerCase() : '';
        const imageName = (item && item.image) ? item.image : '';
        // search in name and image filename
        if ((name && name.includes(t)) || (imageName && imageName.toLowerCase().includes(t))) {
          foundItems.push({
            category: category,
            name: item.name || imageName,
            imagePath: `/assets/${category}/${imageName}`
          });
        }
      });
    });

    setResults(foundItems);
  };

  // when URL query param `q` changes, run the search so Navbar -> /search?q=... works
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    if (q) performSearch(q);
    // if q is empty, clear results
    if (!q) {
      setResults([]);
      setQuery('');
    }
  }, [location.search]);

  return (
    <Box sx={{ minHeight: '80vh', py: 5, backgroundColor: '#f4f9f4' }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1b5e20', fontWeight: 'bold' }}>
          Search Historical Coins
        </Typography>

        {/* সার্চ ইনপুট বক্স */}
        <TextField
          fullWidth
          label="Type coin name (e.g. 1_taka, mughal...)"
          variant="outlined"
          value={query}
          onChange={handleSearch}
          sx={{ mb: 5, backgroundColor: 'white' }}
        />

        {/* রেজাল্ট দেখানো */}
        {results.length > 0 ? (
          <Grid container spacing={3}>
            {results.map((item, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card 
                  sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
                  onClick={() => navigate(`/category/${item.category}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.imagePath}
                    alt={item.name}
                    sx={{ objectFit: 'contain', p: 2, bgcolor: '#fafafa' }}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Category: {item.category.replace(/_/g, ' ')}
                    </Typography>
                  </CardContent>
                </Card>
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
      </Container>
    </Box>
  );
};

export default SearchPage;