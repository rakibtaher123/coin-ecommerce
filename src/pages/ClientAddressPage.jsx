import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, Typography, Button, Box, AppBar, Toolbar, IconButton,
    TextField, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent,
    DialogActions, Chip
} from '@mui/material';
import { ArrowBack, Add, Edit, Delete, Home } from '@mui/icons-material';

const ClientAddressPage = () => {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: 'Home',
            fullName: 'John Doe',
            phone: '01711223344',
            address: '123 Main Street, Dhanmondi',
            city: 'Dhaka',
            postalCode: '1205',
            isDefault: true
        }
    ]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        fullName: '',
        phone: '',
        address: '',
        city: '',
        postalCode: ''
    });

    const handleOpenDialog = (address = null) => {
        if (address) {
            setEditingAddress(address);
            setFormData(address);
        } else {
            setEditingAddress(null);
            setFormData({
                name: '',
                fullName: '',
                phone: '',
                address: '',
                city: '',
                postalCode: ''
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingAddress(null);
    };

    const handleSaveAddress = () => {
        if (editingAddress) {
            // Update existing
            setAddresses(addresses.map(addr =>
                addr.id === editingAddress.id ? { ...formData, id: addr.id, isDefault: addr.isDefault } : addr
            ));
        } else {
            // Add new
            setAddresses([...addresses, { ...formData, id: Date.now(), isDefault: false }]);
        }
        handleCloseDialog();
    };

    const handleDeleteAddress = (id) => {
        if (window.confirm('Delete this address?')) {
            setAddresses(addresses.filter(addr => addr.id !== id));
        }
    };

    const handleSetDefault = (id) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
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
                        My Addresses
                    </Typography>
                    <Button color="inherit" startIcon={<Add />} onClick={() => handleOpenDialog()}>
                        Add New
                    </Button>
                </Toolbar>
            </AppBar>

            <Container sx={{ py: 4 }}>
                <Grid container spacing={2}>
                    {addresses.map((address) => (
                        <Grid item xs={12} md={6} key={address.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Home color="primary" />
                                            <Typography variant="h6">{address.name}</Typography>
                                        </Box>
                                        {address.isDefault && (
                                            <Chip label="Default" color="success" size="small" />
                                        )}
                                    </Box>

                                    <Typography variant="body1" gutterBottom>
                                        {address.fullName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {address.phone}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {address.address}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {address.city} - {address.postalCode}
                                    </Typography>

                                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                        {!address.isDefault && (
                                            <Button
                                                size="small"
                                                onClick={() => handleSetDefault(address.id)}
                                            >
                                                Set Default
                                            </Button>
                                        )}
                                        <Button
                                            size="small"
                                            startIcon={<Edit />}
                                            onClick={() => handleOpenDialog(address)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<Delete />}
                                            onClick={() => handleDeleteAddress(address.id)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address Name (e.g., Home, Office)"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                multiline
                                rows={2}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="City"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Postal Code"
                                value={formData.postalCode}
                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveAddress}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClientAddressPage;
