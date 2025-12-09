import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Select, MenuItem, Button, Chip, CircularProgress 
} from '@mui/material';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. অর্ডার লোড করা
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      // তোমার ব্যাকএন্ড রাউট অনুযায়ী লিংক চেক করো। সাধারণত অ্যাডমিনের জন্য সব অর্ডার দেখার লিংক ভিন্ন হতে পারে।
      // যদি '/api/orders' এ সব অর্ডার আসে তবে এটাই ঠিক আছে।
      const response = await fetch('http://localhost:5000/api/orders', { 
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      // যদি ডাটা অ্যারে হয় তবেই সেট করবে
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

  // ২. স্ট্যাটাস আপডেট হ্যান্ডলার
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
        alert("Status Updated!");
        fetchOrders(); // লিস্ট রিফ্রেশ
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // লোডিং স্টেট
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1e293b' }}>
        Manage Orders 📦
      </Typography>

      {orders.length === 0 ? (
        <Typography variant="h6" color="text.secondary">No orders found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#334155' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Payment</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell sx={{ fontFamily: 'monospace' }}>#{order._id.slice(-6)}</TableCell>
                  
                  {/* ইউজার নেম হ্যান্ডলিং (যদি ইউজার ডিলিট হয়ে যায়) */}
                  <TableCell>{order.user?.name || "Guest / Deleted User"}</TableCell>
                  
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>৳{order.totalPrice}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={
                        order.status === 'Delivered' ? 'success' : 
                        order.status === 'Pending' ? 'warning' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Select
                      size="small"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      sx={{ fontSize: '12px', minWidth: 120, bgcolor: 'white' }}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ViewOrders;