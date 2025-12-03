import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  
  // ১. ডাটা রাখার স্টেট (শুরুতে সব ০)
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });

  useEffect(() => {
    // ২. সিকিউরিটি চেক
    const isAdmin = localStorage.getItem("isAdminLoggedIn");
    if (!isAdmin) {
      navigate("/login");
    }

    // ৩. সার্ভার থেকে আসল ডাটা আনা
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      // আপনার ব্যাকএন্ড API কল করা হচ্ছে
      const response = await fetch('http://localhost:5000/dashboard-stats');
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      
      // সার্ভারের ডাটা স্টেটে সেট করা হলো
      setStats(data); 
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("userRole");
    window.location.href = "/login"; 
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', padding: '15px 25px', borderRadius: '12px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '30px'
      }}>
        <h2 style={{ margin: 0, color: '#166534', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🛡️</span> Admin Dashboard
        </h2>
        <button 
          onClick={handleLogout}
          style={{ backgroundColor: '#dc2626', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          LOGOUT
        </button>
      </div>

      {/* Overview Cards (Real Data) */}
      <h3 style={{ color: '#555', marginBottom: '15px' }}>Live Store Overview</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        {/* Card 1: Total Income */}
        <div style={statCardStyle}>
          <h3 style={{ margin: 0, color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Total Income</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0', color: '#166534' }}>
            {/* এখানে আসল টাকা দেখানো হবে */}
            ৳ {stats.totalIncome?.toLocaleString() || 0}
          </p>
          <span style={{ fontSize: '12px', color: 'green', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>Lifetime Earnings</span>
        </div>

        {/* Card 2: Total Orders */}
        <div style={statCardStyle}>
          <h3 style={{ margin: 0, color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Total Orders</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0', color: '#d97706' }}>
            {stats.totalOrders || 0}
          </p>
          <span style={{ fontSize: '12px', color: 'orange', backgroundColor: '#ffedd5', padding: '2px 8px', borderRadius: '10px' }}>
            {stats.pendingOrders || 0} Pending Action
          </span>
        </div>

        {/* Card 3: Total Products */}
        <div style={statCardStyle}>
          <h3 style={{ margin: 0, color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Total Products</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0', color: '#2563eb' }}>
            {stats.totalProducts || 0}
          </p>
          <span style={{ fontSize: '12px', color: 'blue' }}>Items in Stock</span>
        </div>

        {/* Card 4: Total Users */}
        <div style={statCardStyle}>
          <h3 style={{ margin: 0, color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Active Users</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0', color: '#9333ea' }}>
            {stats.totalUsers || 0}
          </p>
          <span style={{ fontSize: '12px', color: 'purple' }}>Unique Customers</span>
        </div>
      </div>

      {/* Quick Actions Menu */}
      <h3 style={{ color: '#374151', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>Quick Actions</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '20px' }}>
        
        <Link to="/products" style={actionCardStyle('#166534')}>
          <div style={{ fontSize: '30px' }}>📦</div>
          MANAGE PRODUCTS
        </Link>

        <Link to="/orders" style={actionCardStyle('#ca8a04')}>
          <div style={{ fontSize: '30px' }}>🚚</div>
          VIEW ORDERS & COURIER
        </Link>

        <Link to="/users" style={actionCardStyle('#2563eb')}>
          <div style={{ fontSize: '30px' }}>👥</div>
          MANAGE USERS
        </Link>

        <Link to="/feedback" style={actionCardStyle('#9333ea')}>
          <div style={{ fontSize: '30px' }}>💬</div>
          FEEDBACK
        </Link>

        <Link to="/settings" style={actionCardStyle('#4b5563')}>
          <div style={{ fontSize: '30px' }}>⚙️</div>
          SITE SETTINGS
        </Link>

      </div>
    </div>
  );
};

// Styles
const statCardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  textAlign: 'center',
  border: '1px solid #f0f0f0'
};

const actionCardStyle = (bgColor) => ({
  padding: '25px', 
  backgroundColor: bgColor, 
  color: 'white', 
  textDecoration: 'none', 
  borderRadius: '12px', 
  fontSize: '16px', 
  fontWeight: 'bold', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  gap: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
  textAlign: 'center'
});

export default AdminPanel;