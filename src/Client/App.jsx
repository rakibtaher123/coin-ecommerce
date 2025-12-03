import './App.css'; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// 🔥 সঠিক হেডার ফাইল ইমপোর্ট
import Header from './components/Header'; 

// 🛒 ক্লায়েন্ট পেজগুলো
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderStatusPage from './pages/OrderStatusPage';
import SignupPage from './pages/SignupPage'; 

// 🔐 অ্যাডমিন পেজগুলো (Admin ফোল্ডার থেকে সঠিক path)
import AdminLogin from '../../Admin/pages/AdminLogin'; 
import Dashboard from '../../Admin/pages/Dashboard';
import ManageProducts from '../../Admin/pages/ManageProducts';
import ViewOrders from '../../Admin/pages/ViewOrders'; 

// 🔒 ProtectedRoute wrapper
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          {/* =========================
              পাবলিক/ক্লায়েন্ট রাউটস 
             ========================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/signup" element={<SignupPage />} /> 
          <Route path="/my-orders" element={<OrderStatusPage />} />

          {/* =========================
              অ্যাডমিন রাউটস (Secure)
             ========================= */}
          <Route path="/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products" 
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageProducts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute requiredRole="admin">
                <ViewOrders />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
