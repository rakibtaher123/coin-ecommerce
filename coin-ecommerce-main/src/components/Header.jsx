import React, { useContext, useState } from 'react'; // useState ইম্পোর্ট করা হয়েছে
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, InputBase, Button, Menu, MenuItem } from '@mui/material';
import { ShoppingCart, Search, Person, Logout } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // নতুন আইকন
import { useNavigate } from 'react-router-dom';

// আপনার বিদ্যমান Context ইম্পোর্ট:
import { useCart } from '../context/CartProvider';

// AuthContext ইম্পোর্ট
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const navigate = useNavigate();

    // Cart Context
    const { itemCount } = useCart();

    // Auth Context থেকে স্টেট
    const { isLoggedIn, logout, user } = useContext(AuthContext);

    // Dropdown Menu State
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // মেনু ওপেন হ্যান্ডলার
    const handleAuctionClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // মেনু ক্লোজ হ্যান্ডলার
    const handleClose = () => {
        setAnchorEl(null);
    };

    // ড্রপডাউন লিংক হ্যান্ডলার
    const handleNavigate = (path) => {
        navigate(path);
        handleClose();
    };

    // লগআউট হ্যান্ডলার
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <AppBar position="sticky" sx={{ bgcolor: '#1b5e20', px: 2 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

                {/* ✅ LEFT: LOGO & NAVIGATION */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', cursor: 'pointer', mr: 2 }}
                        onClick={() => navigate('/')}
                    >
                        GNG
                    </Typography>

                    {/* --- Navigation Links (Desktop) --- */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
                        <Button color="inherit" onClick={() => navigate('/eshop')}>E-Shop</Button>

                        {/* 🔥 AUCTION DROPDOWN START */}
                        <div>
                            <Button
                                color="inherit"
                                id="auction-button"
                                aria-controls={open ? 'auction-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleAuctionClick}
                                endIcon={<KeyboardArrowDownIcon />}
                            >
                                Auction
                            </Button>
                            <Menu
                                id="auction-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'auction-button',
                                }}
                            >
                                <MenuItem onClick={() => handleNavigate('/auction/live')}>E-AuctionHouse</MenuItem>
                                <MenuItem onClick={() => handleNavigate('/auction/archives')}>Archives</MenuItem>
                            </Menu>
                        </div>
                        {/* 🔥 AUCTION DROPDOWN END */}

                        {/* Admin Dashboard Button */}
                        {isLoggedIn && user?.role === 'Admin' && (
                            <Button
                                color="inherit"
                                onClick={() => navigate('/admin')}
                                sx={{ fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.3)' }}
                            >
                                Admin
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* ✅ CENTER: SEARCH */}
                <Box
                    sx={{
                        display: { xs: 'none', lg: 'flex' }, // ছোট স্ক্রিনে হাইড করা হয়েছে যাতে জায়গা থাকে
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.15)',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        width: 250,
                    }}
                >
                    <Search sx={{ color: 'white', mr: 1 }} />
                    <InputBase
                        placeholder="Search..."
                        sx={{ color: 'white', width: '100%' }}
                    />
                </Box>

                {/* ✅ RIGHT: LOGIN/LOGOUT + CART */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                    <Button
                        color="inherit"
                        onClick={() => navigate('/my-orders')}
                        sx={{ textTransform: 'none', display: { xs: 'none', sm: 'block' } }}
                    >
                        Orders
                    </Button>

                    <IconButton color="inherit" onClick={() => navigate('/cart')}>
                        <Badge badgeContent={itemCount} color="error">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>

                    {!isLoggedIn ? (
                        <>
                            <IconButton color="inherit" onClick={() => navigate('/login')}>
                                <Person />
                            </IconButton>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ bgcolor: '#ff9800', color: '#000', fontWeight: 'bold', ml: 1 }}
                                onClick={() => navigate('/login')}
                            >
                                LOGIN
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="body2" sx={{ color: 'white', display: { xs: 'none', md: 'block' }, mx: 1 }}>
                                {user?.role || 'User'}
                            </Typography>

                            <IconButton color="inherit" onClick={handleLogout} title="Logout">
                                <Logout />
                            </IconButton>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;