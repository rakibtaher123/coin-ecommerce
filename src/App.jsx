import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// কম্পোনেন্ট ইম্পোর্ট
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ক্লায়েন্ট পেজ ইম্পোর্ট
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import EshopPage from './pages/EshopPage';
import AllProductsPage from './pages/AllProductsPage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import SearchPage from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';
import LiveAuctionPage from './pages/LiveAuctionPage';
import ArchivesPage from './pages/ArchivesPage';
import ClientPanel from './pages/ClientPanel';

// ✅ অ্যাডমিন পেজ ইম্পোর্ট (সঠিক পাথ ব্যবহার করা হয়েছে)
// আমরা 'Dashboard.jsx' ব্যবহার করছি কারণ সেখানেই 'Manage Auctions' বাটনটি আছে
import AdminDashboard from './Admin/pages/Dashboard'; 
import ManageAuctions from './Admin/pages/ManageAuctions';
import LiveBiddingMonitor from './Admin/pages/LiveBiddingMonitor';
import AuctionHistory from './Admin/pages/AuctionHistory';
import AdminLogin from './Admin/pages/AdminLogin'; // যদি আলাদা অ্যাডমিন লগইন থাকে

function App() {
    const location = useLocation();

    // 🛑 যদি URL '/admin' দিয়ে শুরু হয়, তাহলে Navbar ও Footer দেখাবে না
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            
            {/* কন্ডিশনাল রেন্ডারিং: অ্যাডমিন প্যানেলে Navbar থাকবে না */}
            {!isAdminRoute && <Navbar />}

            <div style={{ flex: 1 }}>
                <Routes>
                    {/* --- সাধারণ ইউজার রাউটস --- */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/contact" element={<ContactUsPage />} />
                    <Route path="/eshop" element={<EshopPage />} />
                    <Route path="/all-products" element={<AllProductsPage />} />
                    <Route path="/category/:id" element={<CategoryPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/track-order" element={<OrderTrackingPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    
                    {/* --- অকশন রাউটস (ইউজারদের জন্য) --- */}
                    <Route path="/auction/live" element={<LiveAuctionPage />} />
                    <Route path="/auction/archives" element={<ArchivesPage />} />

                    {/* --- ক্লায়েন্ট ড্যাশবোর্ড --- */}
                    <Route path="/client" element={<ClientPanel />} />

                    {/* ✅ অ্যাডমিন প্যানেল রাউটস (Admin Only) */}
                    {/* মেইন ড্যাশবোর্ড */}
                    <Route path="/admin" element={<AdminDashboard />} /> 
                    
                    {/* আলাদা অ্যাডমিন লগইন পেইজ (অপশনাল) */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* অকশন ম্যানেজমেন্ট রাউটস */}
                    <Route path="/admin/auctions" element={<ManageAuctions />} />
                    <Route path="/admin/auctions/live/:id" element={<LiveBiddingMonitor />} />
                    <Route path="/admin/auctions/history" element={<AuctionHistory />} />

                    {/* Fallback Route (ভুল লিংকে গেলে হোমপেজে পাঠাবে) */}
                    <Route path="*" element={<HomePage />} />
                </Routes>
            </div>

            {/* কন্ডিশনাল রেন্ডারিং: অ্যাডমিন প্যানেলে Footer থাকবে না */}
            {!isAdminRoute && <Footer />}
            
        </div>
    );
}

export default App;