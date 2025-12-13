import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Grid, Paper, Typography, Button, Container, CircularProgress, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Tabs, Tab
} from '@mui/material';
import {
  ShoppingBag, AttachMoney, HourglassEmpty, CheckCircle,
  Gavel, Settings, Logout, AccountCircle, LocationOn, Payment
} from '@mui/icons-material';

const ClientPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [checkoutData, setCheckoutData] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // User & Stats State
  const [userName, setUserName] = useState('Valued Customer');
  const [userEmail, setUserEmail] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  });

  // Sample orders data (in real app, fetch from backend)
  const [orders, setOrders] = useState([]);

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

    // Check if showPayment parameter is present
    const searchParams = new URLSearchParams(location.search);
    const shouldShowPayment = searchParams.get('showPayment') === 'true';

    if (shouldShowPayment) {
      // Load checkout data
      const savedCheckoutData = localStorage.getItem('checkoutData');
      console.log('ShowPayment is true, loading checkout data:', savedCheckoutData);
      if (savedCheckoutData) {
        try {
          const parsedData = JSON.parse(savedCheckoutData);
          setCheckoutData(parsedData);
          setActiveTab(4); // Set to Complete Payment tab (index 4)
          console.log('Checkout data loaded, setting tab to 4');
        } catch (err) {
          console.error('Error parsing checkout data:', err);
        }
      } else {
        console.log('No checkout data found in localStorage');
      }
    }

    // In real app, fetch user data and stats from backend
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
              onClick={() => navigate('/e-shop')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ActionButton
              title="Live Auctions"
              icon={<Gavel />}
              color="#d32f2f" // Red
              onClick={() => navigate('/auction/live')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ActionButton
              title="My Orders"
              icon={<ShoppingBag />}
              color="#ed6c02" // Orange
              onClick={() => setActiveTab(0)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ActionButton
              title="Profile Settings"
              icon={<AccountCircle />}
              color="#7b1fa2" // Purple
              onClick={() => setActiveTab(1)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ActionButton
              title="Addresses"
              icon={<LocationOn />}
              color="#0288d1" // Info Blue
              onClick={() => setActiveTab(2)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ActionButton
              title="Payment Methods"
              icon={<Payment />}
              color="#455a64" // Grey
              onClick={() => setActiveTab(3)}
            />
          </Grid>
        </Grid>

        {/* Main Content with Tabs */}
        <Paper sx={{ p: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tab label="My Orders" />
            <Tab label="Profile" />
            <Tab label="Addresses" />
            <Tab label="Payment Methods" />
            <Tab label="Complete Payment" />
          </Tabs>

          {/* Tab 0: Orders */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Order History</Typography>
              {orders.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <ShoppingBag sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Orders Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start shopping to see your orders here
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/e-shop')}
                    sx={{ bgcolor: '#1976d2' }}
                  >
                    Browse Products
                  </Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Order ID</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Items</strong></TableCell>
                        <TableCell><strong>Total</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>৳ {order.total}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={order.status === 'Delivered' ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* Tab 1: Profile */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Profile Settings</Typography>
              <Typography variant="body1" color="text.secondary">
                Profile management features will be available soon.
              </Typography>
            </Box>
          )}

          {/* Tab 2: Addresses */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Saved Addresses</Typography>
              <Typography variant="body1" color="text.secondary">
                Address management features will be available soon.
              </Typography>
            </Box>
          )}

          {/* Tab 3: Payment Methods */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Payment Methods</Typography>
              <Typography variant="body1" color="text.secondary">
                Payment method management features will be available soon.
              </Typography>
            </Box>
          )}

          {/* Tab 4: Complete Payment */}
          {activeTab === 4 && (
            <Box>
              {checkoutData ? (
                <>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#1b5e20' }}>
                    Complete Your Payment
                  </Typography>

                  {/* Order Summary */}
                  <Paper sx={{ p: 3, mb: 3, bgcolor: '#f9f9f9' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Order Summary
                    </Typography>
                    {checkoutData.cartItems.map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>{item.name} x {item.qty}</Typography>
                        <Typography fontWeight="bold">৳{(item.price * item.qty).toLocaleString()}</Typography>
                      </Box>
                    ))}
                    <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Subtotal:</Typography>
                        <Typography>৳{checkoutData.totalPrice.toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6" color="primary">৳{checkoutData.totalPrice.toLocaleString()}</Typography>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Shipping Details */}
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Shipping Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography color="text.secondary" variant="body2">Name:</Typography>
                        <Typography fontWeight="bold">{checkoutData.shippingInfo.firstName} {checkoutData.shippingInfo.lastName}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography color="text.secondary" variant="body2">Address:</Typography>
                        <Typography fontWeight="bold">{checkoutData.shippingInfo.address}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography color="text.secondary" variant="body2">Phone:</Typography>
                        <Typography fontWeight="bold">{checkoutData.shippingInfo.phone}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography color="text.secondary" variant="body2">Courier:</Typography>
                        <Typography fontWeight="bold">{checkoutData.courier}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography color="text.secondary" variant="body2">Payment Method:</Typography>
                        <Typography fontWeight="bold" sx={{ textTransform: 'uppercase' }}>{checkoutData.paymentMethod}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Payment Button */}
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={async () => {
                      setPaymentLoading(true);
                      try {
                        const token = localStorage.getItem('token');
                        const userPayload = token ? JSON.parse(atob(token.split('.')[1])) : {};

                        const paymentData = {
                          amount: checkoutData.totalPrice,
                          orderInfo: {
                            productName: checkoutData.cartItems.map(item => item.name).join(', '),
                            items: checkoutData.cartItems.length
                          },
                          customerInfo: {
                            name: checkoutData.shippingInfo.firstName + ' ' + (checkoutData.shippingInfo.lastName || ''),
                            email: userPayload.email || 'customer@example.com',
                            phone: checkoutData.shippingInfo.phone,
                            address: checkoutData.shippingInfo.address,
                            city: checkoutData.shippingInfo.city || 'Dhaka'
                          }
                        };

                        const response = await fetch('http://localhost:5000/api/payment/initiate', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify(paymentData)
                        });

                        const data = await response.json();

                        if (data.success && data.gatewayUrl) {
                          window.location.href = data.gatewayUrl;
                        } else {
                          alert('Payment initiation failed: ' + (data.message || 'Unknown error'));
                        }
                      } catch (err) {
                        console.error('Payment error:', err);
                        alert('Failed to connect to payment gateway');
                      } finally {
                        setPaymentLoading(false);
                      }
                    }}
                    disabled={paymentLoading}
                    sx={{
                      py: 2,
                      bgcolor: '#1b5e20',
                      '&:hover': { bgcolor: '#004d40' }
                    }}
                  >
                    {paymentLoading ? <CircularProgress size={24} color="inherit" /> : 'Proceed to SSLCommerz Payment'}
                  </Button>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Payment sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Checkout Data Found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Please go to checkout and complete your order first
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/cart')}
                    sx={{ bgcolor: '#1b5e20', '&:hover': { bgcolor: '#004d40' } }}
                  >
                    Go to Cart
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ClientPanel;
