import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect URL from query params
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ Correct API endpoint
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      if (res.data?.token && res.data?.user?.role) {
        // ✅ Save token + role + email
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userRole', res.data.user.role);
        localStorage.setItem('userEmail', res.data.user.email || email); // Save email for bid functionality

        console.log('🎉 Login successful!');
        console.log('Redirect parameter:', redirectTo);

        // ✅ Check for redirect parameter first, then role-based redirect
        // ✅ Check for redirect parameter first, then role-based redirect
        const fromState = location.state?.from;

        if (fromState) {
          console.log('Redirecting to state.from:', fromState);
          navigate(fromState, { replace: true });
        } else if (redirectTo) {
          // Decode the redirect URL (in case it's URL encoded)
          let decodedPath = decodeURIComponent(redirectTo);
          console.log('Decoded redirect path:', decodedPath);

          // Ensure path starts with /
          if (!decodedPath.startsWith('/')) {
            decodedPath = '/' + decodedPath;
          }

          console.log('Redirecting to:', decodedPath);
          navigate(decodedPath, { replace: true });
        } else {
          // Role based redirect
          navigate(res.data.user.role === "admin" ? '/admin' : '/');
        }
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      // ✅ Error message handling improved
      const msg = err.response?.data?.message || err.response?.data?.error || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#2563eb', marginBottom: '10px' }}>Login</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Welcome back to Coin Collector!</p>

        {/* ✅ Error message UI */}
        {error && (
          <div style={{ color: 'red', marginBottom: '15px' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '15px', fontSize: '14px' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#2563eb', fontWeight: 'bold' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  borderRadius: '5px',
  border: '1px solid #ddd'
};

export default Login;
