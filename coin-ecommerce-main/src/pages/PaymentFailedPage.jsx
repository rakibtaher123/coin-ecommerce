import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentFailedPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const reason = searchParams.get('reason') || 'unknown';

    return (
        <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', py: 6 }}>
            <Container maxWidth="sm">
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                    <Cancel sx={{ fontSize: 80, color: '#d32f2f', mb: 3 }} />

                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#d32f2f' }}>
                        Payment Failed
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        {reason === 'cancelled' ? 'You cancelled the payment.' : 'Your payment could not be processed.'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        {reason === 'cancelled'
                            ? 'You can try again or choose a different payment method.'
                            : 'Please check your payment details and try again.'}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                            sx={{ px: 4 }}
                        >
                            Back to Home
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/client/checkout')}
                            sx={{ px: 4, bgcolor: '#1b5e20', '&:hover': { bgcolor: '#004d40' } }}
                        >
                            Try Again
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default PaymentFailedPage;
