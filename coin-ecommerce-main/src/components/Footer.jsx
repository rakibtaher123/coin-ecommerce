import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

// Mobile Banking Icons (Local)
const MOBILE_PAYMENT_ICONS = [
  { name: 'bKash', url: '/assets/logos/bkash.png', alt: 'bKash Payment' },
  { name: 'Nagad', url: '/assets/logos/nagad.png', alt: 'Nagad Payment' },
  { name: 'Rocket', url: '/assets/logos/rocket.png', alt: 'Rocket Payment' },
];

// Courier Services
const COURIER_ICONS = [
  { name: 'Redx', url: 'https://placehold.co/100x60/C2185B/FFFFFF?text=Redx', alt: 'Redx Courier' },
  { name: 'Pathao', url: 'https://placehold.co/100x60/FF9800/FFFFFF?text=Pathao+Courier', alt: 'Pathao Courier' },
  { name: 'Sundarban', url: 'https://placehold.co/100x60/00796B/FFFFFF?text=Sundarban', alt: 'Sundarban Courier' },
  { name: 'SA Paribahan', url: 'https://placehold.co/100x60/455A64/FFFFFF?text=SA+Paribahan', alt: 'SA Paribahan Courier' },
];

const Footer = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: '#00251a', color: 'white', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Gangaridai Numismatic Gallery(GNG) Info */}
          <Grid item xs={12} md={5}>
            <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 'bold' }}>
              GNG
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8 }}>
              পুরাতন এবং দুষ্প্রাপ্য মুদ্রা কেনার একটি বিশ্বস্ত প্রতিষ্ঠান। আমাদের কালেকশন দেখুন এবং ইতিহাসের একটি অংশ নিজের করে নিন।
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" underline="hover">Home</Link>
              <Link href="/eshop" color="inherit" underline="hover">Show All Coins</Link>
              <Link href="/about" color="inherit" underline="hover">About Us</Link>
              <Link href="/contact" color="inherit" underline="hover">Contact Us</Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography variant="body2" paragraph>
              Dhaka,Bangladesh.
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Email: <Link href="mailto:rakibtaher27@gmail.com" color="inherit" underline="hover">rakibtaher27@gmail.com</Link>
            </Typography>
            <Typography variant="body2">
              Phone: +8801945403413
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" href="https://facebook.com" target="_blank"><FacebookIcon /></IconButton>
              <IconButton color="inherit" href="https://twitter.com" target="_blank"><TwitterIcon /></IconButton>
              <IconButton color="inherit" href="https://instagram.com" target="_blank"><InstagramIcon /></IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* --- Payments Section --- */}
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 4, mt: 5, textAlign: 'center' }}>

          <Grid container spacing={4} justifyContent="center" direction="column" alignItems="center">
            {/* 1. Mobile Payments */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: '#D4AF37', fontWeight: 'bold' }}>
                Secured Mobile Payments
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                {MOBILE_PAYMENT_ICONS.map(icon => (
                  <Box key={icon.name} sx={{
                    width: 80, height: 50, backgroundColor: 'white', borderRadius: '8px',
                    p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}>
                    <img
                      src={icon.url}
                      alt={icon.alt}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x60/AAAAAA/FFFFFF?text=" + icon.name; }}
                    />
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* 2. Global & PayPal */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: '#D4AF37', fontWeight: 'bold' }}>
                Global & Local Payments
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Box sx={{
                  width: 80, height: 50, backgroundColor: 'white', borderRadius: '8px',
                  p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)' }
                }}>
                  <img
                    src="/assets/logos/paypal.jpg"
                    alt="PayPal"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x60/003087/FFFFFF?text=PayPal"; }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* --- Courier Section --- */}
        <Box sx={{ pt: 4, mt: 0, textAlign: 'center' }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: '#D4AF37', fontWeight: 'bold' }}>
            Reliable Delivery Partners
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            {COURIER_ICONS.map(icon => (
              <Box key={icon.name} sx={{
                width: 100, height: 50, backgroundColor: 'white', borderRadius: '8px',
                p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' }
              }}>
                <img
                  src={icon.url}
                  alt={icon.alt}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x60/AAAAAA/FFFFFF?text=Courier"; }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Copyright */}
        <Box sx={{ textAlign: 'center', pt: 4, mt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            &copy; {new Date().getFullYear()} Gangaridai Numismatic Gallery(GNG). All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;