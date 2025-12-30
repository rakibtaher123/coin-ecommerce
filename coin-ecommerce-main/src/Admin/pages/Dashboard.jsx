import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Paper, CircularProgress, Card, CardContent, Button, Alert, Snackbar } from '@mui/material';
import { ShoppingCart, Inventory, People, AttachMoney, Gavel, Settings, LocalShipping, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// Reusable Stat Card Component
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

// Reusable Action Button Component
const ActionButton = ({ title, icon, color, path, onClick }) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      onClick={onClick || (() => navigate(path))}
      sx={{
        width: '100%',
        height: '120px',
        bgcolor: color,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        boxShadow: 3,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.03)',
          bgcolor: color,
          filter: 'brightness(0.9)',
        },
      }}
    >
      <Box sx={{ fontSize: 40, mb: 1 }}>{icon}</Box>
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
    </Button>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalIncome: 0,
    activeUsers: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Notification State
  const [notification, setNotification] = useState({ open: false, message: '' });

  useEffect(() => {
    // 1. Check Admin Role Access
    const checkAdmin = () => {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      if (!user || (user.role !== 'admin' && user.role !== 'Admin')) {
        // navigate('/'); 
      }
    };
    checkAdmin();

    // 2. Fetch Stats
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dashboard-stats');
        const data = await res.json();
        if (data.success) {
          setStats({
            totalProducts: data.totalProducts,
            totalOrders: data.totalOrders,
            pendingOrders: data.pendingOrders,
            totalIncome: data.totalIncome,
            activeUsers: data.totalUsers
          });
        }
      } catch (err) {
        console.error("Stats Fetch Error:", err);
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    // 3. Socket.io for Real-time New Order Alerts
    const socket = io('http://localhost:5000');

    socket.on('new_order', (data) => {
      setNotification({
        open: true,
        message: `🔔 New Order! ${data.user} ordered items worth ৳${data.amount}`
      });
      // Refresh stats on new order
      fetchStats();
    });

    return () => {
      socket.disconnect();
    };

  }, [navigate]);

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f4f6f8', minHeight: '100vh' }}>

      {/* 👋 Welcome Header */}
      <Container maxWidth="xl" sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="flex" alignItems="center">
          <Typography variant="h4" fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="span" sx={{ fontSize: '3rem', lineHeight: 1 }}>🛡️</Box>
            Admin Dashboard
          </Typography>
        </Box>
        <Button variant="contained" color="error" endIcon={<Visibility />} onClick={() => {
          localStorage.removeItem('userInfo');
          localStorage.removeItem('token');
          navigate('/login');
        }}>
          LOGOUT
        </Button>
      </Container>

      {/* 🔔 Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity="success" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Container maxWidth="lg">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress size={60} color="success" />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        ) : (
          <>
            {/* --- Stats Overview Section --- */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#444', borderLeft: '5px solid #1b5e20', pl: 2 }}>
              Live Store Overview
            </Typography>

            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="TOTAL INCOME"
                  value={`৳ ${stats.totalIncome?.toLocaleString() || 0}`}
                  icon={<AttachMoney fontSize="large" />}
                  color="#1b5e20" // Green
                  subText="Lifetime Earnings"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="TOTAL ORDERS"
                  value={stats.totalOrders || 0}
                  icon={<ShoppingCart fontSize="large" />}
                  color="#f57c00" // Orange
                  subText={`${stats.pendingOrders || 0} Pending`}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="TOTAL PRODUCTS"
                  value={stats.totalProducts || 0}
                  icon={<Inventory fontSize="large" />}
                  color="#1976d2" // Blue
                  subText="Items in Stock"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="ACTIVE USERS"
                  value={stats.activeUsers || 0}
                  icon={<People fontSize="large" />}
                  color="#7b1fa2" // Purple
                  subText="Registered Clients"
                />
              </Grid>
            </Grid>

            {/* --- Quick Actions Section --- */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#444', borderLeft: '5px solid #1976d2', pl: 2 }}>
              Quick Management
            </Typography>

            <Grid container spacing={3}>

              {/* Row 1: Products, Live System, Users */}
              <Grid item xs={12} sm={6} md={4}>
                <ActionButton
                  title="Manage Products"
                  icon={<Inventory />}
                  color="#2e7d32" // Green
                  path="/admin/products"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <ActionButton
                  title="Live Bidding Control"
                  icon={<Gavel />}
                  color="#ed6c02" // Orange
                  path="/admin/auctions/live-system"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <ActionButton
                  title="Manage Users"
                  icon={<People />}
                  color="#0288d1" // Info Blue
                  path="/admin/users"
                />
              </Grid>

              {/* Row 2: Create Auction, Orders, Settings */}
              <Grid item xs={12} sm={6} md={4}>
                <ActionButton
                  title="Manage Auctions"
                  icon={<Gavel />}
                  color="#d32f2f" // Red
                  path="/admin/auctions"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <ActionButton
                  title="View Orders"
                  icon={<LocalShipping />}
                  color="#f57c00" // Orange-Red
                  path="/admin/orders"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <ActionButton
                  title="Site Settings"
                  icon={<Settings />}
                  color="#455a64" // Grey
                  path="/admin/settings"
                />
              </Grid>

            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;