import React, { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, IconButton,
  InputAdornment, FormControlLabel, Checkbox, Alert, Stack
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    showPassword: false, terms: false
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleTogglePassword = () => {
    setValues(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const validate = () => {
    const errs = {};
    if (!values.name.trim()) errs.name = 'Full name is required.';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(values.email)) errs.email = 'Enter a valid email.';
    if (values.password.length < 6) errs.password = 'At least 6 characters.';
    if (values.password !== values.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (!values.terms) errs.terms = 'Accept terms.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit triggered");

    if (!validate()) {
      console.log("Validation failed");
      return;
    }

    console.log("Validation passed");

    try {
      const response = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        passwordConfirm: values.confirmPassword,
        role: "client",
      });

      console.log("Registration Response:", response);

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 1200);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({ server: err.response?.data?.message || "Registration failed" });
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '80vh', backgroundColor: '#f3f4f6' }}>
      <Paper sx={{ padding: 4, borderRadius: 2, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" sx={{ color: '#ea580c', mb: 1 }}>Create Account</Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>Join Coin Collector today!</Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>Account created!</Alert>}
        {errors.server && <Alert severity="error" sx={{ mb: 2 }}>{errors.server}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Full Name" name="name" value={values.name}
              onChange={handleChange} fullWidth required
              error={Boolean(errors.name)} helperText={errors.name}
            />
            <TextField
              label="Email Address" name="email" value={values.email}
              onChange={handleChange} fullWidth required
              error={Boolean(errors.email)} helperText={errors.email}
            />

            <TextField
              label="Password" name="password"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password} onChange={handleChange}
              fullWidth required
              error={Boolean(errors.password)} helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword}>
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Confirm Password" name="confirmPassword"
              type={values.showPassword ? 'text' : 'password'}
              value={values.confirmPassword} onChange={handleChange}
              fullWidth required
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
            />

            <FormControlLabel
              control={<Checkbox name="terms" checked={values.terms} onChange={handleChange} />}
              label="I agree to the Terms & Conditions"
            />
            {errors.terms && <Typography variant="caption" color="error">{errors.terms}</Typography>}

            <Button type="submit" variant="contained" fullWidth>Register</Button>

            <Typography variant="caption" sx={{ mt: 2 }}>
              Already have an account? <a href="/login">Sign in</a>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
