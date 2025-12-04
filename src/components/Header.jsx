import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, InputBase, Button } from '@mui/material';
import { ShoppingCart, Search, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// 👇 সমস্যা এখানে ছিল। এখন সঠিক ফাইল থেকে ইমপোর্ট করা হয়েছে:
import { useCart } from '../context/CartProvider'; 

const Header = () => {
  const navigate = useNavigate();
  
  // এখন এটি সঠিক itemCount (যেমন: 47) পাবে
  const { itemCount } = useCart(); 

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#1b5e20', px: 2 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* ✅ LEFT: LOGO + TRACK ORDER */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            CoinHouse
          </Typography>

          <Button
            color="inherit"
            onClick={() => navigate('/my-orders')}
            sx={{ textTransform: 'none', display: { xs: 'none', sm: 'block' } }}
          >
            Track Order
          </Button>
        </Box>

        {/* ✅ CENTER: SEARCH */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            background: 'rgba(255,255,255,0.15)',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            width: 300,
          }}
        >
          <Search sx={{ color: 'white', mr: 1 }} />
          <InputBase
            placeholder="Search coins..."
            sx={{ color: 'white', width: '100%' }}
          />
        </Box>

        {/* ✅ RIGHT: LOGIN + CART */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          
          <IconButton color="inherit" onClick={() => navigate('/login')}>
            <Person />
          </IconButton>

          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            {/* badgeContent={itemCount} এখন সঠিক সংখ্যা দেখাবে */}
            <Badge badgeContent={itemCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: '#ff9800', color: '#000', fontWeight: 'bold' }}
            onClick={() => navigate('/login')}
          >
            LOGIN
          </Button>

        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Header;