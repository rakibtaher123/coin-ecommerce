import React, { useState, useContext } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, InputBase, Badge, Menu, MenuItem, Avatar
} from '@mui/material';
import {
  Search, ShoppingCart, Notifications, Person, Logout, KeyboardArrowDown
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount } = useCart();
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  // Auction Dropdown State
  const [anchorEl, setAnchorEl] = useState(null);
  const openAuction = Boolean(anchorEl);

  // --- Handlers ---
  const handleAuctionClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseAuction = () => setAnchorEl(null);

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseAuction();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout(); // AuthContext logout handles both state clearing and redirect
  };

  // 🔥 LOGIC: Check Admin vs Client
  // যদি ইউজার লগইন থাকে এবং ইমেইল 'admin@gmail.com' হয় অথবা রোল 'admin' হয় -> তাহলে সে অ্যাডমিন
  const isAdmin = isLoggedIn && (user?.email === 'admin@gmail.com' || user?.role === 'admin');

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#004D40' }}>
      <Toolbar>

        {/* LOGO */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', cursor: 'pointer', mr: 3 }}
          onClick={() => navigate('/')}
        >
          GNG
        </Typography>

        {/* --- Desktop Menu --- */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
          <Button color="inherit" onClick={() => navigate('/')}>HOME</Button>
          <Button color="inherit" onClick={() => navigate('/eshop')}>E-SHOP</Button>

          {/* Auction Dropdown */}
          <div>
            <Button
              color="inherit"
              onClick={handleAuctionClick}
              endIcon={<KeyboardArrowDown />}
            >
              AUCTION
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={openAuction}
              onClose={handleCloseAuction}
            >
              <MenuItem onClick={() => handleNavigate('/auction/live')}>E-AuctionHouse</MenuItem>
              <MenuItem onClick={() => handleNavigate('/auction/bidding')}>Live Bidding System</MenuItem>
              <MenuItem onClick={() => handleNavigate('/auction/archives')}>Archives</MenuItem>
            </Menu>
          </div>

          <Button color="inherit" onClick={() => navigate('/about')}>ABOUT</Button>
          <Button color="inherit" onClick={() => navigate('/contact')}>CONTACT</Button>
          <Button color="inherit" onClick={() => navigate('/track-order')}>TRACK</Button>

          {/* 🔥 ROLE BASED BUTTON SHOWING */}

          {/* ১. যদি অ্যাডমিন হয় -> Admin Panel দেখাবে */}
          {isAdmin && (
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => navigate('/admin')}
              sx={{ ml: 1, borderColor: 'rgba(255,255,255,0.5)' }}
            >
              Admin Panel
            </Button>
          )}

          {/* ২. যদি লগইন করা থাকে কিন্তু অ্যাডমিন না হয় -> My Account (Client) দেখাবে */}
          {isLoggedIn && !isAdmin && (
            <Button
              color="inherit"
              onClick={() => navigate('/client')}
            >
              My Account
            </Button>
          )}
        </Box>

        {/* --- Search Bar --- */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            bgcolor: 'rgba(255,255,255,0.15)',
            borderRadius: 1,
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            px: 1,
            mr: 2
          }}
        >
          <Search sx={{ color: 'white' }} />
          <InputBase
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ color: 'white', ml: 1, width: 150 }}
          />
        </Box>

        {/* --- Right Side Icons & Auth --- */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={() => navigate('/notifications')}>
            <Notifications />
          </IconButton>

          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={itemCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* Login / Signup / Logout Logic */}
          {isLoggedIn ? (
            <>
              {/* User Profile Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, bgcolor: 'rgba(255,255,255,0.1)', px: 2, py: 0.5, borderRadius: 20 }}>
                <Avatar
                  src={user?.image ? `http://localhost:5000${user.image}` : null}
                  alt={user?.name || "User"}
                  sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : <Person />}
                </Avatar>

                <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 'bold' }}>
                  {user?.name || (isAdmin ? 'Admin' : 'User')}
                </Typography>

                <IconButton color="inherit" onClick={handleLogout} title="Logout" size="small" sx={{ ml: 1 }}>
                  <Logout fontSize="small" />
                </IconButton>
              </Box>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                startIcon={<Person />}
              >
                LOGIN
              </Button>

              {/* 🔥 Sign Up Button Added */}
              <Button
                variant="contained"
                color="warning"
                size="small"
                onClick={() => navigate('/register')}
                sx={{ ml: 1, fontWeight: 'bold' }}
              >
                SIGN UP
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;