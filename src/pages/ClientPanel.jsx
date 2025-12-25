import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Grid, Paper, Typography, Button, Container, CircularProgress,
  Card, CardContent
} from '@mui/material';
import {
  ShoppingBag, AttachMoney, HourglassEmpty, CheckCircle,
  Gavel, Settings, Logout, AccountCircle, LocationOn, Payment
} from '@mui/icons-material';

const ClientPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // User & Stats State
  const [userName, setUserName] = useState('Valued Customer');
  const [userEmail, setUserEmail] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserEmail(payload.email || '');
    } catch (err) {
      console.error('Error parsing token:', err);
    }

    // In real app, fetch user data and stats from backend
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  // Stat Card Component (matching admin style)
  const StatCard = ({ title, value, icon, color, subText }) => (
    <Paper elevation={3} sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', borderRadius: 2 }}>
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1, color: color }}>
          {value}
        </Typography>
        <Typography variant="caption" sx={{ bgcolor: `${color}15`, color: color, px: 1, py: 0.5, borderRadius: 1, fontWeight: 'bold' }}>
          {subText}
        </Typography>
      </Box>
      <Box sx={{ bgcolor: `${color}10`, p: 2, borderRadius: '50%', color: color }}>
        {icon}
      </Box>
    </Paper>
  );

  // Action Button Component (matching admin style)
  const ActionButton = ({ title, icon, color, onClick }) => (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: 10 },
        bgcolor: color,
        color: 'white',
        height: '100%',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 4 }}>
        {React.cloneElement(icon, { sx: { fontSize: 45, mb: 1 } })}
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} color="success" />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', pb: 8 }}>

      {/* Header - matching admin style */}
      <Box sx={{ bgcolor: 'white', px: 4, py: 2, boxShadow: 1, mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', display: 'flex', alignItems: 'center', gap: 1 }}>
          👤 Client Dashboard
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{ fontWeight: 'bold' }}
        >
          Logout
        </Button>
      </Box>

      <Container maxWidth="lg">
        {/* Stats Overview Section */}
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#444', borderLeft: '5px solid #1b5e20', pl: 2 }}>
          My Account Overview
        </Typography>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="TOTAL ORDERS"
              value={stats.totalOrders}
              icon={<ShoppingBag fontSize="large" />}
              color="#1976d2" // Blue
              subText="All Time"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="PENDING"
              value={stats.pendingOrders}
              icon={<HourglassEmpty fontSize="large" />}
              color="#f57c00" // Orange
              subText="In Progress"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="COMPLETED"
              value={stats.completedOrders}
              icon={<CheckCircle fontSize="large" />}
              color="#2e7d32" // Green
              subText="Delivered"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="TOTAL SPENT"
              value={`৳ ${stats.totalSpent.toLocaleString()}`}
              icon={<AttachMoney fontSize="large" />}
              color="#7b1fa2" // Purple
              subText="Lifetime"
            />
          </Grid>
        </Grid>

        {/* Quick Actions Section */}
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#444', borderLeft: '5px solid #1976d2', pl: 2 }}>
          Quick Actions
        </Typography>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={4}>
            <ActionButton
              title="Browse Products"
              icon={<ShoppingBag />}
              color="#1976d2" // Blue
              onClick={() => navigate('/client/products')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ActionButton
              title="E-AuctionHouse"
              icon={<Gavel />}
              color="#d32f2f" // Red
              onClick={() => { window.location.replace('/auction/live'); }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ActionButton
              title="Archives"
              icon={<Gavel />}
              color="#0288d1" // Blue
              onClick={() => { window.location.replace('/auction/archives'); }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ActionButton
              title="Live Bidding System"
              icon={<Gavel />}
              color="#ed6c02" // Orange
              onClick={() => { window.location.replace('/auction/bidding'); }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ActionButton
              title="Bid History"
              icon={<Gavel />}
              color="#7b1fa2" // Purple
              onClick={() => { window.location.replace('/auction/bid-history'); }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ActionButton
              title="My Orders"
              icon={<ShoppingBag />}
              color="#ed6c02" // Orange
              onClick={() => navigate('/client/orders')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ActionButton
              title="Profile Settings"
              icon={<AccountCircle />}
              color="#7b1fa2" // Purple
              onClick={() => navigate('/client/settings')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ActionButton
              title="Addresses"
              icon={<LocationOn />}
              color="#0288d1" // Info Blue
              onClick={() => navigate('/client/address')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ActionButton
              title="Payment Methods"
              icon={<Payment />}
              color="#455a64" // Grey
              onClick={() => navigate('/client/payments')}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ClientPanel;
