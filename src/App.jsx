import React from 'react';
import { Routes, Route } from 'react-router-dom';

// ❌ এই লাইনটি মুছে দাও বা কমেন্ট করো, কারণ main.jsx এ প্রোভাইডার আছে
// import { CartProvider } from './context/CartProvider'; 

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import EshopPage from './pages/EshopPage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import SearchPage from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPanel from './pages/AdminPanel';
import ClientPanel from './pages/ClientPanel';

function App() {
  return (
    // ❌ <CartProvider> এখান থেকে সরিয়ে ফেলা হয়েছে
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />

          <Route path="/eshop" element={<EshopPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductPage />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/track-order" element={<OrderTrackingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/client" element={<ClientPanel />} />

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
    // ❌ </CartProvider> এখান থেকে সরিয়ে ফেলা হয়েছে
  );
}

export default App;