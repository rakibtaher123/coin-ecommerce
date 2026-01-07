import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Select, MenuItem, Button, Chip,
  CircularProgress, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Divider, Alert
} from '@mui/material';
import { Delete, Visibility, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ViewOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // For Details Dialog

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Optimistic update
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
        alert("Status Updated!");
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setOrders(orders.filter(o => o._id !== id));
        alert("Order Deleted!");
      } else {
        alert("Failed to delete order");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Loading State
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
          📦 Manage Orders
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/admin')}>
          Back to Dashboard
        </Button>
      </Box>

      {orders.length === 0 ? (
        <Alert severity="info">No orders found.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#1b5e20' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Payment</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status Controller</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#{order._id.slice(-6)}</TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">{order.user?.name || "Deleted User"}</Typography>
                    <Typography variant="caption" color="text.secondary">{order.user?.email}</Typography>
                  </TableCell>

                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>৳{order.totalPrice.toLocaleString()}</TableCell>

                  <TableCell>
                    <Chip
                      label={order.isPaid ? "PAID" : "UNPAID"}
                      color={order.isPaid ? "success" : "error"}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="caption" display="block">{order.paymentMethod}</Typography>
                  </TableCell>

                  <TableCell>
                    <Select
                      size="small"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      sx={{
                        fontSize: '13px',
                        height: 35,
                        minWidth: 130,
                        bgcolor: 'white',
                        '& .MuiSelect-select': { py: 1 }
                      }}
                    >
                      <MenuItem value="Pending">🕒 Pending</MenuItem>
                      <MenuItem value="Processing">⚙️ Processing</MenuItem>
                      <MenuItem value="Shipped">🚚 Shipped</MenuItem>
                      <MenuItem value="Delivered">✅ Delivered</MenuItem>
                      <MenuItem value="Cancelled">❌ Cancelled</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => setSelectedOrder(order)}
                        sx={{ bgcolor: '#e3f2fd' }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteOrder(order._id)}
                        sx={{ bgcolor: '#ffebee' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f5f5' }}>
              <Typography variant="h6">Order Details #{selectedOrder._id}</Typography>
              <IconButton onClick={() => setSelectedOrder(null)}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Shipping Info</Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                    <Typography variant="body2">{selectedOrder.shippingAddress?.address}</Typography>
                    <Typography variant="body2">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Customer Info</Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                    <Typography variant="body2">Name: {selectedOrder.user?.name}</Typography>
                    <Typography variant="body2">Email: {selectedOrder.user?.email}</Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Order Items</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Qty</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.orderItems.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">{item.qty}</TableCell>
                            <TableCell align="right">৳{item.price}</TableCell>
                            <TableCell align="right">৳{item.price * item.qty}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      Total Amount: ৳{selectedOrder.totalPrice.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedOrder(null)} color="primary">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

    </Box>
  );
};

export default ViewOrders;