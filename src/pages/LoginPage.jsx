import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect URL from query params
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || 'client';
  const showPayment = searchParams.get('showPayment');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ Admin shortcut (local check)
    if (email === "admin@gmail.com" && password === "1234") {
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("userRole", "admin");
      console.log("Welcome Admin!");
      window.location.href = "/admin";
      return;
    }

    // ✅ Client login via backend
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        console.log("Login Successful!");

        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          // Redirect to specified page or default to client dashboard
          const redirectPath = redirectTo || 'client';
          console.log('Redirecting to:', `/${redirectPath}`);
          navigate(`/${redirectPath}`);
        }
      } else {
        setError(data.message || "Invalid Email or Password!");
        console.log(data.message || "Invalid Email or Password!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Server Error! Please try again.");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Login to Coin Collector</h2>
        <p style={{ color: '#6b7280', marginBottom: '30px', fontSize: '14px' }}>Welcome back! Please login to your account.</p>

        {error && (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '5px', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#374151' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d1d5db', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#374151' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d1d5db', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
          >
            Login
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#374151' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#10b981', fontWeight: 'bold', textDecoration: 'none' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
