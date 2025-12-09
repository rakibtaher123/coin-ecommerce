import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  // লোকাল স্টোরেজ চেক
  const isAdmin = localStorage.getItem("isAdminLoggedIn");

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("userRole");
    window.location.href = "/login"; // লগইন পেজে পাঠাবে
  };

  return (
    <header style={{ backgroundColor: '#166534', padding: '15px 0', color: 'white' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '90%', margin: '0 auto' }}>
        
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
          Coin Collector
        </Link>

        <nav>
          <Link to="/" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>E-SHOP</Link>
          <Link to="/about" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>ABOUT US</Link>
          {/* অ্যাডমিন হলে প্যানেল লিংক দেখাবে */}
          {isAdmin && <Link to="/admin" style={{ color: '#facc15', margin: '0 15px', textDecoration: 'none', fontWeight: 'bold' }}>ADMIN PANEL</Link>}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {isAdmin ? (
            // যদি অ্যাডমিন হয়, তবে লগআউট বাটন দেখাবে
            <button 
              onClick={handleLogout}
              style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              LOGOUT
            </button>
          ) : (
            // অ্যাডমিন না হলে লগইন বাটন দেখাবে
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>LOGIN</Link>
              <Link to="/signup" style={{ backgroundColor: '#ea580c', color: 'white', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
                CREATE ACCOUNT
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;