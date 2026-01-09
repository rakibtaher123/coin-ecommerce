import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, IconButton, Chip, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  TextField, InputAdornment, Select, MenuItem, FormControl, Tooltip
} from '@mui/material';
import {
  Delete, Search, ArrowBack, Person, Email, Phone, LocationCity, CalendarToday,
  AdminPanelSettings, Edit, Save, Cancel
} from '@mui/icons-material';

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null, userName: '' });
  const [editingRole, setEditingRole] = useState({ userId: null, newRole: '' });

  // Load users from API
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://gangaridai-auction.onrender.com/api/auth/users');

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        throw new Error(data.message || "Failed to load users");
      }
    } catch (err) {
      console.error("Load Users Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query) ||
        user.city.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Delete user handler
  const handleDeleteClick = (userId, userName) => {
    setDeleteDialog({ open: true, userId, userName });
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`https://gangaridai-auction.onrender.com/api/auth/users/${deleteDialog.userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.filter(u => u._id !== deleteDialog.userId));
        setDeleteDialog({ open: false, userId: null, userName: '' });
      } else {
        alert(`Failed to delete user: ${data.message}`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user");
    }
  };

  // Role change handlers
  const handleRoleEditClick = (userId, currentRole) => {
    setEditingRole({ userId, newRole: currentRole });
  };

  const handleRoleSave = async (userId) => {
    try {
      const response = await fetch(`https://gangaridai-auction.onrender.com/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: editingRole.newRole })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setUsers(users.map(u => u._id === userId ? { ...u, role: editingRole.newRole } : u));
        setEditingRole({ userId: null, newRole: '' });
      } else {
        alert(`Failed to update role: ${data.message}`);
      }
    } catch (err) {
      console.error("Role update failed:", err);
      alert("Failed to update role");
    }
  };

  const handleRoleCancel = () => {
    setEditingRole({ userId: null, newRole: '' });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'client': return 'primary';
      case 'user': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', pb: 8 }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', px: 4, py: 2, boxShadow: 1, mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/admin')} color="primary">
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
            👥 Manage Users
          </Typography>
        </Box>
        <Chip
          label={`Total Users: ${users.length}`}
          color="primary"
          icon={<Person />}
          sx={{ fontWeight: 'bold', fontSize: '1rem', px: 1 }}
        />
      </Box>

      <Container maxWidth="xl">
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by name, email, phone, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 3 }}>
            ❌ {error}
          </Alert>
        )}

        {/* Empty State */}
        {!loading && !error && filteredUsers.length === 0 && (
          <Paper sx={{ p: 5, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {searchQuery ? 'No users found matching your search' : 'No users registered yet'}
            </Typography>
          </Paper>
        )}

        {/* Users Table */}
        {!loading && !error && filteredUsers.length > 0 && (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ bgcolor: '#e5e7eb' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}><Person sx={{ verticalAlign: 'middle', mr: 1 }} />Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}><Email sx={{ verticalAlign: 'middle', mr: 1 }} />Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}><Phone sx={{ verticalAlign: 'middle', mr: 1 }} />Phone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}><LocationCity sx={{ verticalAlign: 'middle', mr: 1 }} />City</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}><AdminPanelSettings sx={{ verticalAlign: 'middle', mr: 1 }} />Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}><CalendarToday sx={{ verticalAlign: 'middle', mr: 1 }} />Joined</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell sx={{ fontWeight: 'medium' }}>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.city}, {user.postalCode}</TableCell>
                    <TableCell>
                      {editingRole.userId === user._id ? (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <FormControl size="small" sx={{ minWidth: 100 }}>
                            <Select
                              value={editingRole.newRole}
                              onChange={(e) => setEditingRole({ ...editingRole, newRole: e.target.value })}
                            >
                              <MenuItem value="client">Client</MenuItem>
                              <MenuItem value="user">User</MenuItem>
                            </Select>
                          </FormControl>
                          <Tooltip title="Save">
                            <IconButton size="small" color="success" onClick={() => handleRoleSave(user._id)}>
                              <Save />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton size="small" color="error" onClick={handleRoleCancel}>
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            label={user.role}
                            color={getRoleColor(user.role)}
                            size="small"
                            sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                          />
                          <Tooltip title="Change Role">
                            <IconButton size="small" onClick={() => handleRoleEditClick(user._id, user.role)}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Delete User">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(user._id, user.name)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, userId: null, userName: '' })}
      >
        <DialogTitle sx={{ bgcolor: '#fee', color: '#c00' }}>
          ⚠️ Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user <strong>{deleteDialog.userName}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, userId: null, userName: '' })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageUsers;

