import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, InputBase, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';

export const HISTORICAL_CATEGORIES = [
  'Janapada Series',
  'Ancient Bengal',
  'Medieval Bengal',
  'Sultanhi',
  'Mughal',
  'East India Company',
  'British Indian Coins',
  'British Indian Notes',
  'Pakistani Coins',
  'Pakistani Notes',
  'Bangladeshi Republic Coins',
  'Bangladeshi Republic Notes',
];

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // ✅ FIX: আমরা 'itemCount' আনছি, কারণ Provider এ 'cart' নামে কিছু নেই, আছে 'items'
  const { itemCount } = useCart();

  // ✅ Read user from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user')) || null;
  } catch (err) {
    user = null;
  }

  // ✅ Search handler
  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1b5e20' }}>
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', cursor: 'pointer', mr: 3 }}
          onClick={() => navigate('/')}
        >
          Coin Collector
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/eshop')}>E-SHOP</Button>
          <Button color="inherit" onClick={() => navigate('/about')}>ABOUT US</Button>
          <Button color="inherit" onClick={() => navigate('/contact')}>CONTACT US</Button>
          <Button color="inherit" onClick={() => navigate('/track-order')}>TRACK ORDER</Button>

          {/* ✅ Role-based links */}
          {user?.role === 'admin' && (
            <Button color="inherit" onClick={() => navigate('/admin')}>ADMIN PANEL</Button>
          )}
          {user?.role === 'client' && (
            <Button color="inherit" onClick={() => navigate('/client')}>MY ACCOUNT</Button>
          )}
        </Box>

        {/* Search Bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            mr: 2,
          }}
        >
          <IconButton type="submit" sx={{ p: 0.5 }}>
            <SearchIcon sx={{ color: 'white' }} />
          </IconButton>
          <InputBase
            placeholder="Search coins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ color: 'white', py: 0.5, pr: 1 }}
          />
        </Box>

        {/* Icons + Auth Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={() => navigate('/notifications')}>
            <NotificationsIcon />
          </IconButton>

          {/* ✅ FIXED: Cart Icon with Badge */}
          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={itemCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* ✅ Auth Buttons */}
          {user ? (
            <Button color="inherit" onClick={handleLogout}>LOGOUT</Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>LOGIN</Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => navigate('/register')}
                sx={{ ml: 1, color: 'white' }}
              >
                CREATE A FREE ACCOUNT
              </Button>
            </>
          )}

          <IconButton color="inherit" sx={{ display: { xs: 'block', sm: 'none' } }}>
            <PersonIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;