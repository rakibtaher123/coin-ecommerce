import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { Alert, CircularProgress } from '@mui/material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // টোকেন থাকলে রোল চেক করে রিডাইরেক্ট করা হবে
      const role = localStorage.getItem('userRole');
      const target = role === 'admin' ? '/admin' : '/client';
      navigate(target, { replace: true });
    }
  }, [navigate]);

  // আগের পেজের লোকেশন খুঁজে বের করা
  const fromPath = location.state?.from?.pathname || location.state?.from || null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // ❌ আগে এখানে হার্ডকোড করা ডামি টোকেন ছিল, সেটা ডিলিট করা হয়েছে।
    // এখন সরাসরি ব্যাকএন্ড API কল হবে।

    try {
      const response = await loginUser({ email, password });

      if (response.status === 200) {
        const data = response.data;

        // ✅ সার্ভার থেকে আসা আসল টোকেন সেভ করা হচ্ছে
        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.user)); // ✅ Fix: Store full user info
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", data.user.name);

        // রোল অনুযায়ী রিডাইরেক্ট
        if (data.user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          // fromPath থাকলে সেখানে যাবে, না থাকলে /client এ যাবে
          const targetPath = fromPath || '/client';
          navigate(targetPath, { replace: true });
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      // এরর হ্যান্ডলিং আরও সুন্দর করা হয়েছে
      const errorMsg = err.response?.data?.message || err.message || "Invalid Email or Password!";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Dynamic CSS for pseudo-classes */}
      <style>{`
        .gng-form-input:focus { border-color: #1a237e !important; box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1); }
        .gng-form-button:hover { background-color: #000051 !important; transform: translateY(-1px); }
        .gng-form-button:active { transform: translateY(0); }
        .gng-form-button:disabled { background-color: #ccc !important; cursor: not-allowed; transform: none; }
      `}</style>

      <div style={styles.card}>
        <h2 style={styles.title}>Login to GNG</h2>
        <p style={styles.subtitle}>Welcome back! Please login to your account.</p>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="gng-form-input"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="gng-form-input"
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} className="gng-form-button" style={styles.button}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'LOGIN'}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account? <Link to="/register" state={{ from: fromPath }} style={styles.link}>Sign Up Here</Link>
        </div>
      </div>
    </div>
  );
};

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
    maxWidth: '450px'
  },
  title: { textAlign: 'center', color: '#1a237e', marginBottom: '10px', fontWeight: 'bold', fontSize: '28px' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '15px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', color: '#374151', fontWeight: 'bold' },
  input: {
    padding: '12px 15px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    transition: 'all 0.3s',
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
  },
  footer: { marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#374151' },
  link: { color: '#d32f2f', fontWeight: 'bold', textDecoration: 'none' }
};

export default LoginPage;