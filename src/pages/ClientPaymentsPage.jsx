import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, Typography, Button, Box, AppBar, Toolbar, IconButton,
    Card, CardContent, Grid, Chip, Alert
} from '@mui/material';
import { ArrowBack, CreditCard, AccountBalance, Star } from '@mui/icons-material';

const ClientPaymentsPage = () => {
    const navigate = useNavigate();
    const [savedMethods] = useState([
        {
            id: 1,
            type: 'bkash',
            name: 'bKash',
            number: '01711223344',
            isDefault: true
        },
        {
            id: 2,
            type: 'nagad',
            name: 'Nagad',
            number: '01811223344',
            isDefault: false
        }
    ]);

    const getPaymentIcon = (type) => {
        if (type === 'bkash' || type === 'nagad' || type === 'rocket') {
            return <CreditCard />;
        }
        return <AccountBalance />;
    };

    const getPaymentColor = (type) => {
        switch (type.toLowerCase()) {
            case 'bkash': return '#E2136E';
            case 'nagad': return '#F15D22';
            case 'rocket': return '#8E3A8E';
            case 'bank': return '#1976d2';
            default: return '#gray';
        }
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
                        Payment Methods
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ py: 4 }} maxWidth="md">
                <Alert severity="info" sx={{ mb: 3 }}>
                    Payment is processed securely through SSLCommerz gateway. You can pay with bKash, Nagad, Rocket, or any card during checkout.
                </Alert>

                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Saved Payment Methods
                </Typography>

                {savedMethods.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            No saved payment methods yet
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={2}>
                        {savedMethods.map((method) => (
                            <Grid item xs={12} key={method.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        borderRadius: '50%',
                                                        bgcolor: getPaymentColor(method.type) + '20',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {getPaymentIcon(method.type)}
                                                </Box>
                                                <Box>
                                                    <Typography variant="h6">{method.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {method.number}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {method.isDefault && (
                                                <Chip
                                                    icon={<Star />}
                                                    label="Default"
                                                    color="success"
                                                    size="small"
                                                />
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Paper sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Available Payment Options at Checkout:
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {['bKash', 'Nagad', 'Rocket', 'Visa/Mastercard', 'Bank Transfer'].map((method) => (
                            <Grid item xs={6} sm={4} key={method}>
                                <Chip label={method} sx={{ width: '100%' }} />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default ClientPaymentsPage;
