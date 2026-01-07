import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// কম্পোনেন্ট ইম্পোর্ট
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ক্লায়েন্ট পেজ ইম্পোর্ট
import HomePage from './pages/Homepage';
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
import LiveBiddingPage from './pages/LiveBiddingPage';
import ArchivesPage from './pages/ArchivesPage';
import BidHistoryPage from './pages/BidHistoryPage';
import LiveAuctionsListPage from './pages/LiveAuctionsListPage';
import ClientPanel from './pages/ClientPanel';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import PaymentConfirm from './pages/PaymentConfirm'; // Import PaymentConfirm

// Client Dashboard Pages
import ClientProductsPage from './pages/ClientProductsPage';
import ClientProductDetailsPage from './pages/ClientProductDetailsPage'; // ✅ Import ClientProductDetailsPage
import ClientCartPage from './pages/ClientCartPage'; // ✅ Import ClientCartPage
import ClientOrdersPage from './pages/ClientOrdersPage';
import ClientOrderDetailsPage from './pages/ClientOrderDetailsPage'; // ✅ New Import
import ClientSettingsPage from './pages/ClientSettingsPage';
import ClientAddressPage from './pages/ClientAddressPage';
import ClientPaymentsPage from './pages/ClientPaymentsPage';
import ClientAuctionsPage from './pages/ClientAuctionsPage';
import BidStatusPage from './pages/BidStatusPage';       // নতুন: Bid Status Page
import AuctionWonPage from './pages/AuctionWonPage';     // নতুন: Auction Won Page
import AuctionLostPage from './pages/AuctionLostPage';   // নতুন: Auction Lost Page

// ✅ অ্যাডমিন পেজ ইম্পোর্ট (নতুন পেজগুলো যুক্ত করা হয়েছে)
import AdminDashboard from './Admin/pages/Dashboard';
import AdminLogin from './Admin/pages/AdminLogin';

// 🔥 MISSING IMPORTS ADDED HERE
import ManageAuctions from './Admin/pages/ManageAuctions';
import ManageAuctionsBidder from './Admin/pages/ManageAuctionsBidder'; // ✅ Import
import LiveBiddingMonitor from './Admin/pages/LiveBiddingMonitor';
import LiveBiddingSystem from './Admin/pages/LiveBiddingSystem'; // নতুন
import AuctionHistory from './Admin/pages/AuctionHistory';
import ManageProducts from './Admin/pages/ManageProducts'; // নতুন
import ViewOrders from './Admin/pages/ViewOrders';         // নতুন
import ManageUsers from './Admin/pages/ManageUsers';       // নতুন
import SiteSettings from './Admin/pages/SiteSettings';     // নতুন
import FeedbackPage from './Admin/pages/FeedbackPage';     // নতুন (ফাইলের নাম চেক করে নিও FeedbackPage.jsx নাকি ViewFeedback.jsx)
import RealizationPage from './pages/RealizationPage';   // Correctly imported here
import ManageArchives from './pages/ManageArchives';     // 🗂️ Manage Archives

import PrivateRoute from './PrivateRoute';

function App() {
    const location = useLocation();

    // 🛑 যদি URL '/admin', '/client', '/auction', বা '/payment' দিয়ে শুরু হয়, তাহলে Navbar ও Footer দেখাবে না
    const isAdminRoute = location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/client') ||
        location.pathname.startsWith('/auction') ||
        location.pathname.startsWith('/payment');

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
                    <Route path="/client/checkout" element={<CheckoutPage />} />

                    {/* ✅ New Payment Confirmation Route */}
                    <Route
                        path="/client/payment"
                        element={
                            <PrivateRoute>
                                <PaymentConfirm />
                            </PrivateRoute>
                        }
                    />

                    {/* Legacy/Fallback Payment Route if needed */}
                    <Route
                        path="/payment"
                        element={
                            <PrivateRoute>
                                <PaymentPage />
                            </PrivateRoute>
                        }
                    />

                    <Route path="/payment-success" element={<PaymentSuccessPage />} />
                    <Route path="/payment-failed" element={<PaymentFailedPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/track-order" element={<OrderTrackingPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />

                    {/* --- অকশন রাউটস (ইউজারদের জন্য) --- */}
                    <Route path="/auction" element={<Navigate to="/auction/live" replace />} />
                    <Route path="/auction/live" element={<LiveAuctionsListPage />} />
                    <Route path="/auction/live/:id" element={<LiveAuctionPage />} />
                    <Route path="/auction/archives" element={<ArchivesPage />} />
                    <Route path="/archives" element={<ArchivesPage />} /> {/* ✅ Added shortcut route */}
                    <Route path="/auction/bidding" element={<LiveBiddingPage />} />
                    <Route path="/realization/:id" element={<RealizationPage />} />
                    <Route path="/auction/bid-history" element={<BidHistoryPage />} />

                    {/* --- ক্লায়েন্ট ড্যাশবোর্ড --- */}
                    <Route path="/client" element={<ClientPanel />} />
                    <Route path="/client/products" element={<ClientProductsPage />} />
                    <Route path="/client/product/:id" element={<ClientProductDetailsPage />} /> {/* ✅ New Client Product Route */}
                    <Route path="/client/cart" element={<ClientCartPage />} /> {/* ✅ New Client Cart Route */}
                    <Route path="/client/orders" element={<ClientOrdersPage />} />
                    <Route path="/client/orders/:id" element={<ClientOrderDetailsPage />} /> {/* ✅ New Route */}
                    <Route path="/client/settings" element={<ClientSettingsPage />} />
                    <Route path="/client/profile" element={<ClientSettingsPage />} />       {/* Alias for Profile Settings */}
                    <Route path="/client/bid-history" element={<BidHistoryPage />} />       {/* Alias for Bid History */}
                    <Route path="/client/auction/live" element={<LiveAuctionPage />} />     {/* Alias for Live Auction */}
                    <Route path="/client/address" element={<ClientAddressPage />} />
                    <Route path="/client/payments" element={<ClientPaymentsPage />} />
                    <Route path="/client/auctions" element={<ClientAuctionsPage />} />
                    <Route path="/client/auction/bidding" element={<LiveBiddingPage />} /> {/* 🔥 নতুন: ড্যাশবোর্ডের ভেতরে বিডিং পেজ */}
                    <Route path="/client/auction/bid-status/:auctionId" element={<BidStatusPage />} /> {/* 🆕 Bid Status */}
                    <Route path="/client/auction/win/:auctionId" element={<AuctionWonPage />} /> {/* 🎉 Auction Won */}
                    <Route path="/client/auction/lost/:auctionId" element={<AuctionLostPage />} /> {/* 😔 Auction Lost */}

                    {/* ✅ অ্যাডমিন প্যানেল রাউটস (Admin Only) */}

                    {/* ১. ড্যাশবোর্ড */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* ২. এই রাউটগুলো মিসিং ছিল, তাই বাটন কাজ করত না */}
                    <Route path="/admin/products" element={<ManageProducts />} />
                    <Route path="/admin/orders" element={<ViewOrders />} />
                    <Route path="/admin/users" element={<ManageUsers />} />
                    <Route path="/admin/settings" element={<SiteSettings />} />
                    <Route path="/admin/feedback" element={<FeedbackPage />} />
                    <Route path="/admin/manage-archives" element={<ManageArchives />} /> {/* 🗂️ Manage Archives */}

                    {/* ৩. অকশন ম্যানেজমেন্ট রাউটস */}
                    <Route path="/admin/auctions" element={<ManageAuctions />} />
                    <Route path="/admin/auctions/bidders" element={<ManageAuctionsBidder />} /> {/* ✅ New Route */}
                    <Route path="/admin/auctions/live-system" element={<LiveBiddingSystem />} />
                    <Route path="/admin/auctions/live/:id" element={<LiveBiddingMonitor />} />
                    <Route path="/admin/auctions/history" element={<AuctionHistory />} />

                    {/* Fallback Route */}
                    <Route path="*" element={<HomePage />} />
                </Routes>
            </div>

            {/* কন্ডিশনাল রেন্ডারিং: অ্যাডমিন প্যানেলে Footer থাকবে না */}
            {!isAdminRoute && <Footer />}

        </div>
    );
}

export default App;