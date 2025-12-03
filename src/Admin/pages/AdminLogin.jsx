import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // পাসওয়ার্ড দেখার জন্য স্টেট
  const navigate = useNavigate();

  // ১. পেজে ঢোকার সাথে সাথে আগের সেশন ক্লিয়ার হবে (সেফটি)
  useEffect(() => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("userRole");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    // ২. ট্রিম ফাংশন: যাতে ভুলে স্পেস পড়লেও সমস্যা না হয়
    if (email.trim() === "admin@gmail.com" && password.trim() === "1234") {
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("userRole", "admin"); // রোল সেট করা হলো
      
      console.log("✅ Login Successful! Welcome Admin.");
      
      // ড্যাশবোর্ডে পাঠানো (উইন্ডো রিলোড দিয়ে যাতে হেডার আপডেট হয়)
      window.location.href = "/admin"; 
    } else {
      console.log("❌ Access Denied! Incorrect Email or Password.");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#ecfdf5', fontFamily: 'Segoe UI, sans-serif' }}>
      
      <div style={{ 
        backgroundColor: 'white', padding: '40px', borderRadius: '15px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', 
        textAlign: 'center', borderTop: '6px solid #166534' 
      }}>
        
        <div style={{ fontSize: '50px', marginBottom: '10px' }}>🛡️</div>
        
        <h2 style={{ color: '#166534', marginBottom: '5px', fontWeight: 'bold' }}>ADMIN PORTAL</h2>
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>Secure Login for Coin Collector</p>

        <form onSubmit={handleLogin}>
          
          {/* Email Input */}
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold', color: '#4b5563' }}>Admin Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com" 
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px' }}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold', color: '#4b5563' }}>Password</label>
            <input 
              type={showPassword ? "text" : "password"} // পাসওয়ার্ড দেখানো/লুকানোর লজিক
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter PIN" 
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px' }}
            />
          </div>

          {/* Show Password Checkbox */}
          <div style={{ textAlign: 'left', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <input 
               type="checkbox" 
               id="showPass" 
               onChange={() => setShowPassword(!showPassword)}
               style={{ cursor: 'pointer' }}
             />
             <label htmlFor="showPass" style={{ fontSize: '13px', color: '#555', cursor: 'pointer' }}>Show Password</label>
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '14px', backgroundColor: '#166534', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', transition: '0.3s' }}
          >
            🔒 SECURE LOGIN
          </button>

        </form>

        <div style={{ marginTop: '20px', fontSize: '12px', color: '#9ca3af' }}>
          Restricted Area • IP Logged
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;