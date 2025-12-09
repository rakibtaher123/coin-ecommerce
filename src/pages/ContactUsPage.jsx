import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Container, Grid, TextField, Button, 
  Snackbar, Alert 
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log("Form Submitted:", formData); 

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ padding: '32px', marginY: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" gutterBottom>
          যেকোনো প্রশ্ন বা তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।
        </Typography>

        <Grid container spacing={5} sx={{ marginTop: 4 }}>
          <Grid item xs={12} md={5}>
            <Typography variant="h5" gutterBottom>যোগাযোগের তথ্য</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ mr: 2 }} color="primary" />
              <Typography variant="body1">+8801945403413</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 2 }} color="primary" />
              <Typography variant="body1">rakibtaher27@gmail.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 2 }} color="primary" />
              <Typography variant="body1">329,330 DIT Industrial Area ( Tongi Chuna Factory ) ,Tongi-Bazar,Dhaka.</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Typography variant="h5" gutterBottom>Send us a Message</Typography>
            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
              <TextField 
                label="Your Name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth 
                sx={{ mb: 2 }} 
              />
              <TextField 
                label="Your Email" 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth 
                sx={{ mb: 2 }} 
              />
              <TextField 
                label="Subject" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                fullWidth 
                sx={{ mb: 2 }} 
              />
              <TextField 
                label="Your Message" 
                multiline 
                rows={4} 
                name="message"
                value={formData.message}
                onChange={handleChange}
                fullWidth 
                sx={{ mb: 2 }} 
              />
              <Button type="submit" variant="contained" color="primary" size="large">
                Send Message
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Message sent successfully! We will get back to you soon.
        </Alert>
      </Snackbar>
      
    </Container>
  );
}

export default ContactUsPage;
