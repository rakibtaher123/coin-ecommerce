import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Grid, Paper, Typography, Button, Container, CircularProgress, Card, CardContent 
} from '@mui/material';
import { 
  Inventory, ShoppingCart, People, AttachMoney, 
  Gavel, Settings, Logout, Feedback, LocalShipping 
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Dashboard Stats State
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  
  const [loading, setLoading] = useState(true);

  // 🔐 Security & Data Fetching
  useEffect(() => {
    const token = localStorage.getItem("token");
    // const user = JSON.parse(localStorage.getItem("user"));

    // সিকিউরিটি চেক (Optional: আনকমেন্ট করতে পারেন)
    // if (!token || user?.role !== 'admin') {
    //   navigate("/login"); 
    // }

    // Stats লোড করা
    fetchDashboardStats(token);
  }, [navigate]);

  const fetchDashboardStats = async (token) => {
    try {
      // আপনার ব্যাকএন্ড API এন্ডপয়েন্ট
      const response = await fetch("http://localhost:5000/api/dashboard-stats", {
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

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
  const ActionButton = ({ title, icon, color, path }) => (
    <Card 
      onClick={() => navigate(path)}
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', pb: 8 }}>
      
      {/* --- Header --- */}
      <Box sx={{ bgcolor: 'white', px: 4, py: 2, boxShadow: 1, mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', display: 'flex', alignItems: 'center', gap: 1 }}>
          🛡️ Admin Dashboard
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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress size={60} color="success" />
          </Box>
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
                  value={stats.totalUsers || 0} 
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
              
              <Grid item xs={12} sm={6} md={4}>
                <ActionButton 
                  title="Manage Products" 
                  icon={<Inventory />} 
                  color="#2e7d32" // Green
                  path="/admin/products"
                />
              </Grid>

              {/* 🔥 Manage Auctions Button Added (Red Color) */}
              <Grid item xs={12} sm={6} md={4}>
                <ActionButton 
                  title="Manage Auctions" 
                  icon={<Gavel />} 
                  color="#d32f2f" // Red (Highlight)
                  path="/admin/auctions"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <ActionButton 
                  title="View Orders" 
                  icon={<LocalShipping />} 
                  color="#ed6c02" // Orange
                  path="/admin/orders"
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

              <Grid item xs={12} sm={6} md={4}>
                <ActionButton 
                  title="Feedbacks" 
                  icon={<Feedback />} 
                  color="#9c27b0" // Purple
                  path="/admin/feedback"
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