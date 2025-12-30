import React, { useState, useContext } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, 
  Container, Alert, CircularProgress, InputAdornment, IconButton 
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // আপনার AuthContext পাথ অনুযায়ী এডজাস্ট করুন

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Context থেকে login ফাংশন

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ইনপুট হ্যান্ডলার
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // টাইপ করলে এরর চলে যাবে
  };

  // সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. ব্যাকএন্ডে রিকোয়েস্ট পাঠানো
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // 2. অ্যাডমিন চেক করা (Security Check)
      if (data.role !== 'admin' && data.role !== 'Admin') {
        throw new Error('Access Denied: You are not an Admin!');
      }

      // 3. সফল হলে Context আপডেট এবং রিডাইরেক্ট
      login(data); // Context এ ইউজার ডাটা এবং টোকেন সেভ করা
      navigate('/admin'); // ড্যাশবোর্ডে পাঠানো

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#e8f5e9' // হালকা সবুজ ব্যাকগ্রাউন্ড
      }}
    >
      <Container maxWidth="xs">
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            borderRadius: 3 
          }}
        >
          {/* লোগো বা আইকন */}
          <Box 
            sx={{ 
              bgcolor: '#1b5e20', 
              p: 2, 
              borderRadius: '50%', 
              color: 'white', 
              mb: 2 
            }}
          >
            <Lock fontSize="large" />
          </Box>

          <Typography component="h1" variant="h5" fontWeight="bold" sx={{ color: '#1b5e20', mb: 3 }}>
            Admin Login
          </Typography>

          {/* এরর মেসেজ */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* লগইন ফর্ম */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5, 
                bgcolor: '#1b5e20', 
                fontWeight: 'bold', 
                '&:hover': { bgcolor: '#004d40' } 
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'SIGN IN'}
            </Button>

            <Typography variant="body2" color="text.secondary" align="center">
              Only authorized personnel can access this panel.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;