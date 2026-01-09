import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ সঠিক backend route: /api/auth/register
      const response = await fetch('https://gangaridai-auction.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("🎉 Account Created Successfully!");
        navigate('/login'); // সফল হলে লগইন পেজে পাঠাবে
      } else {
        setError(data.error || "Signup Failed!");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setError("Server Error! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#ea580c', marginBottom: '10px' }}>Create Account</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Join Coin Collector today!</p>

        {/* ✅ Error message UI */}
        {error && (
          <div style={{ color: 'red', marginBottom: '15px' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required style={inputStyle} />
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required style={inputStyle} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={inputStyle} />
          
          <button 
            type="submit" 
            disabled={loading} 
            style={{ width: '100%', padding: '12px', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '15px', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#ea580c', fontWeight: 'bold' }}>Login</Link>
        </div>
      </div>
    </div>
  );
};

const inputStyle = { 
  width: '100%', 
  padding: '10px', 
  marginBottom: '15px', 
  borderRadius: '5px', 
  border: '1px solid #ddd' 
};

export default SignupPage;

