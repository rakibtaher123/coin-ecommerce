import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { Alert, Box, CircularProgress } from '@mui/material';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from || '/client';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { name, email, password, passwordConfirm, phone, address, city, postalCode } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await registerUser(formData);
      if (response.status === 201 || response.status === 200) {
        alert('Registration Successful! Redirecting to Login...');
        // Pass the original 'from' path to the login page so it can redirect back to checkout
        navigate('/login', { state: { from: fromPath } });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Registration Failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Dynamic CSS for pseudo-classes that don't work in inline styles */}
      <style>{`
        .gng-form-input:focus { border-color: #1a237e !important; box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1); }
        .gng-form-button:hover { background-color: #000051 !important; transform: translateY(-1px); }
        .gng-form-button:active { transform: translateY(0); }
        .gng-form-button:disabled { background-color: #ccc !important; cursor: not-allowed; transform: none; }
      `}</style>

      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join Gangaridai Heritage to start bidding</p>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Personal Info */}
          <div style={styles.row}>
            <input type="text" name="name" placeholder="Full Name" value={name} onChange={handleChange} required className="gng-form-input" style={styles.input} />
            <input type="text" name="phone" placeholder="Mobile Number" value={phone} onChange={handleChange} required className="gng-form-input" style={styles.input} />
          </div>

          <input type="email" name="email" placeholder="Email Address" value={email} onChange={handleChange} required className="gng-form-input" style={styles.input} />

          <div style={styles.row}>
            <input type="password" name="password" placeholder="Password" value={password} onChange={handleChange} required className="gng-form-input" style={styles.input} />
            <input type="password" name="passwordConfirm" placeholder="Confirm Password" value={passwordConfirm} onChange={handleChange} required className="gng-form-input" style={styles.input} />
          </div>

          {/* Address Info (Shipping) */}
          <h4 style={{ margin: '15px 0 5px', color: '#1a237e', fontSize: '14px', fontWeight: 'bold' }}>Shipping Details (For Delivery & Invoicing)</h4>
          <textarea name="address" placeholder="Full Street Address (Building, Street, Area)" value={address} onChange={handleChange} required className="gng-form-input" style={{ ...styles.input, height: '80px', fontFamily: 'inherit' }} />

          <div style={styles.row}>
            <input type="text" name="city" placeholder="City" value={city} onChange={handleChange} required className="gng-form-input" style={styles.input} />
            <input type="text" name="postalCode" placeholder="Postal / Zip Code" value={postalCode} onChange={handleChange} required className="gng-form-input" style={styles.input} />
          </div>

          <button type="submit" disabled={loading} className="gng-form-button" style={styles.button}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'REGISTER NOW'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          Already have an account? <span style={{ color: '#d32f2f', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/login', { state: { from: fromPath } })}>Login here</span>
        </p>
      </div>
    </div>
  );
};

// Professional Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
    backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    width: '100%',
    maxWidth: '550px'
  },
  title: { textAlign: 'center', color: '#1a237e', marginBottom: '10px', fontWeight: 'bold', fontSize: '28px' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '15px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  row: { display: 'flex', gap: '15px' },
  input: {
    padding: '12px 15px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    transition: 'all 0.3s'
  },
  button: {
    padding: '15px',
    backgroundColor: '#1a237e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: '0.3s',
    boxShadow: '0 4px 10px rgba(26, 35, 126, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default RegisterPage;
