import './App.css'; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';

// Admin Pages
import Dashboard from './pages/Dashboard';
import ManageProducts from './pages/ManageProducts';
import ViewOrders from './pages/ViewOrders';
import ManageUsers from './pages/ManageUsers';
import FeedbackPage from './pages/FeedbackPage';
import SiteSettings from './pages/SiteSettings';

function AdminApp() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div style={{ flexGrow: 1, padding: '20px' }}>
          <AdminHeader />
          <div style={{ marginTop: '20px' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<ManageProducts />} />
              <Route path="/orders" element={<ViewOrders />} />
              <Route path="/users" element={<ManageUsers />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/settings" element={<SiteSettings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default AdminApp;