import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div style={{ width: '250px', background: '#2c3e50', color: 'white', padding: '20px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '30px' }}>Admin Dashboard</h2>
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        <Link to="/" style={{ color: 'white', marginBottom: '15px', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/products" style={{ color: 'white', marginBottom: '15px', textDecoration: 'none' }}>Manage Products</Link>
        <Link to="/orders" style={{ color: 'white', marginBottom: '15px', textDecoration: 'none' }}>View Orders</Link>
        <Link to="/feedback" style={{ color: 'white', marginBottom: '15px', textDecoration: 'none' }}>Receive Feedback</Link>
        {/* Notifications / Courier Management Link (Manual Management UI needed) */}
      </nav>
    </div>
  );
};

export default AdminSidebar;
