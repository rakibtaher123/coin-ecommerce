import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const tranId = searchParams.get('tran_id');

    // Clear checkout data
    React.useEffect(() => {
        localStorage.removeItem('checkoutData');
    }, []);

    return (
        <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', py: 6 }}>
            <Container maxWidth="sm">
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                    <CheckCircle sx={{ fontSize: 80, color: '#1b5e20', mb: 3 }} />

                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1b5e20' }}>
                        Payment Successful!
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        Your payment has been processed successfully.
                    </Typography>

                    {tranId && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Transaction ID: <strong>{tranId}</strong>
                        </Typography>
                    )}

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        You will receive a confirmation email shortly.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/client')}
                            sx={{ px: 4 }}
                        >
                            My Dashboard
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/')}
                            sx={{ px: 4, bgcolor: '#1b5e20', '&:hover': { bgcolor: '#004d40' } }}
                        >
                            Continue Shopping
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default PaymentSuccessPage;
