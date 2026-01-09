import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Paper, Typography, Button, Container, CircularProgress, Card, CardContent
} from '@mui/material';
import {
  Inventory, ShoppingCart, People, AttachMoney,
  Gavel, Settings, Logout, Feedback, LocalShipping, Archive
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalIncome: 0, totalOrders: 0, pendingOrders: 0, totalProducts: 0, totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchDashboardStats(token);
  }, []);

  const fetchDashboardStats = async (token) => {
    try {
      const response = await fetch("https://gangaridai-auction.onrender.com/api/dashboard-stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    // No navigate needed - logout() handles redirect with full page reload
  };


  // Reusable Component
  const StatCard = ({ title, value, icon, color, subText }) => (
    <Paper elevation={3} sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
      <Box>
        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">{title}</Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ my: 1, color: color }}>{value}</Typography>
        <Typography variant="caption" sx={{ bgcolor: `${color}15`, color: color, px: 1, py: 0.5, borderRadius: 1, fontWeight: 'bold' }}>{subText}</Typography>
      </Box>
      <Box sx={{ bgcolor: `${color}10`, p: 2, borderRadius: '50%', color: color }}>{icon}</Box>
    </Paper>
  );

  const ActionButton = ({ title, icon, color, path }) => (
    <Card onClick={() => navigate(path)} sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }, bgcolor: color, color: 'white', height: '100%', transition: '0.3s' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        {React.cloneElement(icon, { sx: { fontSize: 45, mb: 1 } })}
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', pb: 8 }}>
      <Box sx={{ bgcolor: 'white', px: 4, py: 2, boxShadow: 1, mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>🛡️ Admin Dashboard</Typography>
        <Button variant="contained" color="error" startIcon={<Logout />} onClick={handleLogout}>Logout</Button>
      </Box>

      <Container maxWidth="lg">
        {loading ? <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box> : (
          <>
            {/* Stats */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#444' }}>Live Store Overview</Typography>
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} sm={6} md={3}><StatCard title="INCOME" value={`৳${stats.totalIncome}`} icon={<AttachMoney />} color="#1b5e20" subText="Total" /></Grid>
              <Grid item xs={12} sm={6} md={3}><StatCard title="ORDERS" value={stats.totalOrders} icon={<ShoppingCart />} color="#f57c00" subText={`${stats.pendingOrders} Pending`} /></Grid>
              <Grid item xs={12} sm={6} md={3}><StatCard title="PRODUCTS" value={stats.totalProducts} icon={<Inventory />} color="#1976d2" subText="In Stock" /></Grid>
              <Grid item xs={12} sm={6} md={3}><StatCard title="USERS" value={stats.totalUsers} icon={<People />} color="#7b1fa2" subText="Active" /></Grid>
            </Grid>

            {/* Quick Actions */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#444' }}>Quick Management</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}><ActionButton title="Manage Products" icon={<Inventory />} color="#2e7d32" path="/admin/products" /></Grid>

              {/* 🔥 Manage Auctions Button */}
              <Grid item xs={12} sm={6} md={4}><ActionButton title="Manage Auctions" icon={<Gavel />} color="#d32f2f" path="/admin/auctions" /></Grid>

              <Grid item xs={12} sm={6} md={4}><ActionButton title="Live Bidding Control" icon={<Gavel />} color="#f57c00" path="/admin/live-bidding" /></Grid>
              <Grid item xs={12} sm={6} md={4}><ActionButton title="Manage Users" icon={<People />} color="#0288d1" path="/admin/users" /></Grid>
              <Grid item xs={12} sm={6} md={4}><ActionButton title="View Orders" icon={<LocalShipping />} color="#ed6c02" path="/admin/orders" /></Grid>
              <Grid item xs={12} sm={6} md={4}><ActionButton title="Site Settings" icon={<Settings />} color="#455a64" path="/admin/settings" /></Grid>

              {/* 🗂️ Bidder Management Button */}
              <Grid item xs={12} sm={6} md={4}><ActionButton title="Bidder Management" icon={<People />} color="#00695c" path="/admin/auctions/bidders" /></Grid>

              {/* 🗂️ Manage Archives Button - Next to Bidder Management */}
              <Grid item xs={12} sm={6} md={4}><ActionButton title="Manage Archives" icon={<Archive />} color="#5e35b1" path="/admin/manage-archives" /></Grid>
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default AdminPanel;
