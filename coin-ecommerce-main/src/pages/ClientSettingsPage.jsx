import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, Typography, Button, Box, AppBar, Toolbar, IconButton,
    TextField, Grid, Alert, Avatar
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';

const ClientSettingsPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        // Load user data from token
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setFormData(prev => ({
                    ...prev,
                    email: payload.email || '',
                    name: payload.name || '',
                    phone: payload.phone || '',
                    address: payload.address || '',
                    city: payload.city || '',
                    postalCode: payload.postalCode || ''
                }));
            } catch (err) {
                console.error('Error parsing token:', err);
            }
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ✅ 1. Image Upload Handler
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('https://gangaridai-auction.onrender.com/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                setFormData(prev => ({ ...prev, image: data.imagePath }));
                // Optional: Auto-save or let user click save
            } else {
                alert('Image upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    // ✅ 2. Save Profile (Updates Name, Phone, Image)
    const handleSaveProfile = async () => {
        try {
            // Get user ID from token or context (Here relying on localStorage for simplicity of this snippet context)
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('userInfo'));

            if (!user || !token) return;

            const response = await fetch('https://gangaridai-auction.onrender.com/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: user._id,
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    image: formData.image
                })
            });

            const data = await response.json();

            if (data.success) {
                setSaveMessage('✅ Profile updated successfully!');
                // Update Local Storage
                localStorage.setItem('userInfo', JSON.stringify(data.user));
                // Reload window to reflect changes in Header
                setTimeout(() => window.location.reload(), 1000);
            } else {
                setSaveMessage('❌ ' + data.message);
            }
        } catch (error) {
            console.error("Profile Save Error:", error);
            setSaveMessage('❌ Failed to update profile');
        }
        setTimeout(() => setSaveMessage(''), 3000);
    };

    // ✅ 3. Change Password
    const handleChangePassword = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            setSaveMessage('❌ Passwords do not match!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('userInfo'));

            const response = await fetch('https://gangaridai-auction.onrender.com/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: user._id,
                    password: formData.newPassword
                })
            });

            const data = await response.json();
            if (data.success) {
                setSaveMessage('✅ Password changed successfully!');
                setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
            } else {
                setSaveMessage('❌ ' + data.message);
            }
        } catch (error) {
            setSaveMessage('❌ Failed to change password');
        }
        setTimeout(() => setSaveMessage(''), 3000);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* Header */}
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => navigate('/client')}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                        Profile Settings
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ py: 4 }} maxWidth="md">
                {saveMessage && (
                    <Alert severity={saveMessage.includes('✅') ? 'success' : 'error'} sx={{ mb: 3 }}>
                        {saveMessage}
                    </Alert>
                )}

                {/* Profile Information */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Profile Information
                    </Typography>

                    {/* ✅ Image Upload Section */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Avatar
                            src={formData.image ? `https://gangaridai-auction.onrender.com${formData.image}` : undefined}
                            sx={{ width: 100, height: 100, mb: 1, border: '2px solid #ddd' }}
                        >
                            {formData.name.charAt(0)}
                        </Avatar>
                        <Button variant="outlined" component="label" size="small">
                            Upload Picture
                            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                        </Button>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled
                                helperText="Email cannot be changed"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Postal Code"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSaveProfile}
                            >
                                Save Profile
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Change Password */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Change Password
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Current Password"
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="New Password"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleChangePassword}
                            >
                                Change Password
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default ClientSettingsPage;

