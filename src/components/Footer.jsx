import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

// Use public/assets paths
const PAYMENT_ICONS = [
  { name: 'bKash', url: '/assets/logos/bkash.png', alt: 'bKash Payment' },
  { name: 'Nagad', url: '/assets/logos/nagad.png', alt: 'Nagad Payment' },
  { name: 'Rocket', url: '/assets/logos/rocket.png', alt: 'Rocket Payment' },
];

const COURIER_ICONS = [
  { name: 'Redx', url: 'https://placehold.co/100x60/C2185B/FFFFFF?text=Redx', alt: 'Redx Courier' },
  { name: 'Pathao', url: 'https://placehold.co/100x60/FF9800/FFFFFF?text=Pathao+Courier', alt: 'Pathao Courier' },
  { name: 'Sundarban', url: 'https://placehold.co/100x60/00796B/FFFFFF?text=Sundarban', alt: 'Sundarban Courier' },
  { name: 'SA Paribahan', url: 'https://placehold.co/100x60/455A64/FFFFFF?text=SA+Paribahan', alt: 'SA Paribahan Courier' },
];

const Footer = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: '#1b5e20', color: 'white', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* CoinHouseMarket Info */}
          <Grid item xs={12} md={5}>
            <Typography variant="h6" gutterBottom sx={{ color: '#c8e6c9', fontWeight: 'bold' }}>
              CoinHouseMarket
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              পুরাতন এবং দুষ্প্রাপ্য মুদ্রা কেনার একটি বিশ্বস্ত প্রতিষ্ঠান। আমাদের কালেকশন দেখুন এবং ইতিহাসের একটি অংশ নিজের করে নিন।
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#c8e6c9', fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box>
              <Link href="/" color="inherit" underline="hover" display="block">Home</Link>
              <Link href="/eshop" color="inherit" underline="hover" display="block">Show All Coins</Link>
              <Link href="/about" color="inherit" underline="hover" display="block">About Us</Link>
              <Link href="/contact" color="inherit" underline="hover" display="block">Contact Us</Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#c8e6c9', fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography variant="body2">
              329,300 DIT Industrial Area (Tongi Factory), Tongi, Dhaka.
            </Typography>
            <Typography variant="body2">
              Email: <Link href="mailto:rakibtaher27@gmail.com" color="inherit" underline="hover">rakibtaher27@gmail.com</Link>
            </Typography>
            <Typography variant="body2">
              Phone: +8801945403413
            </Typography>
            <Box sx={{ mt: 1 }}>
              <IconButton color="inherit" href="https://facebook.com" target="_blank"><FacebookIcon /></IconButton>
              <IconButton color="inherit" href="https://twitter.com" target="_blank"><TwitterIcon /></IconButton>
              <IconButton color="inherit" href="https://instagram.com" target="_blank"><InstagramIcon /></IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Payment Icons */}
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 3, mt: 4, textAlign: 'center' }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: '#c8e6c9', fontWeight: 'bold' }}>
            Secured Mobile Payments
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            {PAYMENT_ICONS.map(icon => (
              <Box key={icon.name} sx={{
                width: 100, height: 60, backgroundColor: 'white', borderRadius: '12px',
                p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.4)', transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' }
              }}>
                <img 
                  src={icon.url} 
                  alt={icon.alt} 
                  style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x60/AAAAAA/FFFFFF?text=Logo"; }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Courier Icons */}
        <Box sx={{ pt: 3, mt: 4, textAlign: 'center' }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: '#c8e6c9', fontWeight: 'bold' }}>
            Reliable Delivery Partners
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            {COURIER_ICONS.map(icon => (
              <Box key={icon.name} sx={{
                width: 120, height: 60, backgroundColor: 'white', borderRadius: '12px',
                p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.4)', transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' }
              }}>
                <img 
                  src={icon.url} 
                  alt={icon.alt} 
                  style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x60/AAAAAA/FFFFFF?text=Service"; }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Copyright */}
        <Box sx={{ textAlign: 'center', pt: 3, mt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="caption">
            &copy; 2025 CoinHouseMarket. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
