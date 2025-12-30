import './App.css'; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartProvider';

// 🔥 Components
import Header from './components/Header'; 
import ProtectedRoute from './components/ProtectedRoute';

// 🛒 Client Pages
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';          // ✅ ADD THIS
import CheckoutPage from './pages/CheckoutPage';
import OrderStatusPage from './pages/OrderStatusPage';
import SignupPage from './pages/SignupPage';
import UserLogin from './pages/LoginPage';        // ✅ USER LOGIN আলাদা রাখা হলো

// 🔐 Admin Pages
import AdminLogin from '../../Admin/pages/AdminLogin'; 
import Dashboard from '../../Admin/pages/Dashboard';
import ManageProducts from '../../Admin/pages/ManageProducts';
import ViewOrders from '../../Admin/pages/ViewOrders'; 

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />

        <Routes>
          {/* =================
              CLIENT ROUTES
             ================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />         {/* ✅ REQUIRED */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<UserLogin />} />       {/* ✅ USER LOGIN */}
          <Route path="/my-orders" element={<OrderStatusPage />} />

          {/* =================
              ADMIN ROUTES
             ================= */}
          <Route path="/admin-login" element={<AdminLogin />} />

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
