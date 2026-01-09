import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Button, Tabs, Tab, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, CircularProgress, Alert
} from '@mui/material';
import { Edit, Delete, Add, Close } from '@mui/icons-material';

const ManageArchives = () => {
    const [tabValue, setTabValue] = useState(0);
    const [demoArchives, setDemoArchives] = useState([]);
    const [completedAuctions, setCompletedAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentArchive, setCurrentArchive] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        image: '',
        headerText: '',
        catalogueLink: '',
        order: 0,
        realization: []
    });

    useEffect(() => {
        fetchDemoArchives();
        fetchCompletedAuctions();
    }, []);

    const fetchDemoArchives = async () => {
        try {
            const response = await fetch('https://gangaridai-auction.onrender.com/api/demo-archives');
            const data = await response.json();
            setDemoArchives(data);
        } catch (error) {
            console.error('Error fetching demo archives:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompletedAuctions = async () => {
        try {
            const response = await fetch('https://gangaridai-auction.onrender.com/api/auctions');
            const data = await response.json();
            const completed = data.filter(auction => auction.status === 'closed' || auction.status === 'sold');
            setCompletedAuctions(completed);
        } catch (error) {
            console.error('Error fetching completed auctions:', error);
        }
    };

    const handleOpenDialog = (archive = null) => {
        if (archive) {
            setEditMode(true);
            setCurrentArchive(archive);
            setFormData({
                title: archive.title,
                date: archive.date,
                time: archive.time || '',
                image: archive.image,
                headerText: archive.headerText || '',
                catalogueLink: archive.catalogueLink || '',
                order: archive.order || 0,
                realization: archive.realization || []
            });
        } else {
            setEditMode(false);
            setCurrentArchive(null);
            setFormData({
                title: '',
                date: '',
                time: '',
                image: '',
                headerText: '',
                catalogueLink: '',
                order: 0,
                realization: []
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditMode(false);
        setCurrentArchive(null);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const url = editMode
            ? `https://gangaridai-auction.onrender.com/api/demo-archives/${currentArchive._id}`
            : 'https://gangaridai-auction.onrender.com/api/demo-archives';

        const method = editMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setAlert({ show: true, message: `Archive ${editMode ? 'updated' : 'created'} successfully!`, type: 'success' });
                fetchDemoArchives();
                handleCloseDialog();
            } else {
                const error = await response.json();
                setAlert({ show: true, message: error.error || 'Failed to save archive', type: 'error' });
            }
        } catch (error) {
            setAlert({ show: true, message: 'Network error', type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this archive?')) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`https://gangaridai-auction.onrender.com/api/demo-archives/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setAlert({ show: true, message: 'Archive deleted successfully!', type: 'success' });
                fetchDemoArchives();
            } else {
                setAlert({ show: true, message: 'Failed to delete archive', type: 'error' });
            }
        } catch (error) {
            setAlert({ show: true, message: 'Network error', type: 'error' });
        }
    };

    const handleDeleteAuction = async (id) => {
        if (!window.confirm('Are you sure you want to delete this auction from archives?')) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`https://gangaridai-auction.onrender.com/api/auctions/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setAlert({ show: true, message: 'Auction deleted successfully!', type: 'success' });
                fetchCompletedAuctions();
            } else {
                setAlert({ show: true, message: 'Failed to delete auction', type: 'error' });
            }
        } catch (error) {
            setAlert({ show: true, message: 'Network error', type: 'error' });
        }
    };

    const addRealizationLot = () => {
        setFormData({
            ...formData,
            realization: [...formData.realization, { lot: '', name: '', price: '', status: 'SOLD' }]
        });
    };

    const updateRealizationLot = (index, field, value) => {
        const updated = [...formData.realization];
        updated[index][field] = value;
        setFormData({ ...formData, realization: updated });
    };

    const removeRealizationLot = (index) => {
        const updated = formData.realization.filter((_, i) => i !== index);
        setFormData({ ...formData, realization: updated });
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                    🗂️ Manage Archives
                </Typography>

                {alert.show && (
                    <Alert severity={alert.type} onClose={() => setAlert({ ...alert, show: false })} sx={{ mb: 2 }}>
                        {alert.message}
                    </Alert>
                )}

                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
                    <Tab label="Demo Archives (Admin Managed)" />
                    <Tab label="Completed Auctions (Auto)" />
                </Tabs>

                {/* Tab 1: Demo Archives */}
                {tabValue === 0 && (
                    <Box>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => handleOpenDialog()}
                            sx={{ mb: 2 }}
                        >
                            Add New Demo Archive
                        </Button>

                        {loading ? (
                            <Box sx={{ textAlign: 'center', py: 5 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Order</strong></TableCell>
                                            <TableCell><strong>Title</strong></TableCell>
                                            <TableCell><strong>Date</strong></TableCell>
                                            <TableCell><strong>Lots</strong></TableCell>
                                            <TableCell><strong>Actions</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {demoArchives.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">No demo archives found</TableCell>
                                            </TableRow>
                                        ) : (
                                            demoArchives.map((archive) => (
                                                <TableRow key={archive._id}>
                                                    <TableCell>{archive.order}</TableCell>
                                                    <TableCell>{archive.title}</TableCell>
                                                    <TableCell>{archive.date}</TableCell>
                                                    <TableCell>{archive.realization?.length || 0}</TableCell>
                                                    <TableCell>
                                                        <IconButton color="primary" onClick={() => handleOpenDialog(archive)}>
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton color="error" onClick={() => handleDelete(archive._id)}>
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                )}

                {/* Tab 2: Completed Auctions */}
                {tabValue === 1 && (
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            These auctions are automatically added when their end time passes. You can edit or delete them.
                        </Typography>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Lot Number</strong></TableCell>
                                        <TableCell><strong>Product Name</strong></TableCell>
                                        <TableCell><strong>Final Price</strong></TableCell>
                                        <TableCell><strong>Status</strong></TableCell>
                                        <TableCell><strong>Actions</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {completedAuctions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">No completed auctions yet</TableCell>
                                        </TableRow>
                                    ) : (
                                        completedAuctions.map((auction) => (
                                            <TableRow key={auction._id}>
                                                <TableCell>{auction.lotNumber || 'N/A'}</TableCell>
                                                <TableCell>{auction.productName}</TableCell>
                                                <TableCell>৳{auction.currentPrice?.toLocaleString()}</TableCell>
                                                <TableCell>{auction.status}</TableCell>
                                                <TableCell>
                                                    <IconButton color="error" onClick={() => handleDeleteAuction(auction._id)}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Dialog for Add/Edit Demo Archive */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>
                        {editMode ? 'Edit Demo Archive' : 'Add New Demo Archive'}
                        <IconButton onClick={handleCloseDialog} sx={{ position: 'absolute', right: 8, top: 8 }}>
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <TextField
                                label="Title"
                                fullWidth
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Date"
                                    fullWidth
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                                <TextField
                                    label="Time"
                                    fullWidth
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </Box>
                            <TextField
                                label="Image URL"
                                fullWidth
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                            <TextField
                                label="Header Text (Bengali)"
                                fullWidth
                                value={formData.headerText}
                                onChange={(e) => setFormData({ ...formData, headerText: e.target.value })}
                            />
                            <TextField
                                label="Catalogue Link (PDF)"
                                fullWidth
                                value={formData.catalogueLink}
                                onChange={(e) => setFormData({ ...formData, catalogueLink: e.target.value })}
                            />
                            <TextField
                                label="Display Order"
                                type="number"
                                fullWidth
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            />

                            <Typography variant="h6" sx={{ mt: 2 }}>Realization Lots</Typography>
                            {formData.realization.map((lot, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <TextField
                                        label="Lot #"
                                        size="small"
                                        value={lot.lot}
                                        onChange={(e) => updateRealizationLot(index, 'lot', e.target.value)}
                                    />
                                    <TextField
                                        label="Name"
                                        size="small"
                                        fullWidth
                                        value={lot.name}
                                        onChange={(e) => updateRealizationLot(index, 'name', e.target.value)}
                                    />
                                    <TextField
                                        label="Price"
                                        size="small"
                                        value={lot.price}
                                        onChange={(e) => updateRealizationLot(index, 'price', e.target.value)}
                                    />
                                    <TextField
                                        label="Status"
                                        size="small"
                                        select
                                        SelectProps={{ native: true }}
                                        value={lot.status}
                                        onChange={(e) => updateRealizationLot(index, 'status', e.target.value)}
                                    >
                                        <option value="SOLD">SOLD</option>
                                        <option value="UNSOLD">UNSOLD</option>
                                    </TextField>
                                    <IconButton color="error" onClick={() => removeRealizationLot(index)}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button variant="outlined" startIcon={<Add />} onClick={addRealizationLot}>
                                Add Lot
                            </Button>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button variant="contained" onClick={handleSubmit}>
                            {editMode ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default ManageArchives;

