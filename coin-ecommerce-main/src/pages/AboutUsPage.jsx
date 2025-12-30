import React from 'react';
import { Box, Container, Typography, Paper, Grid, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PublicIcon from '@mui/icons-material/Public';

// Use local profile image if available; fall back to generated avatar.
const founderImage = '/assets/profile/rakib-taher.jpg';
const founderFallback = "https://ui-avatars.com/api/?name=Rakib&background=1b5e20&color=fff&size=200&font-size=0.5";

function AboutUsPage() {
  return (
    <Box sx={{ backgroundColor: '#e3f2fd', minHeight: '80vh', py: 6 }}>
      <Container maxWidth="lg">

        <Paper
          elevation={5}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: '12px',
            backgroundColor: 'white',
            border: '1px solid #c8e6c9'
          }}
        >

          {/* Header Section */}
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: '900', color: '#1b5e20', mb: 1 }}
          >
            About Gangaridai Numismatic Gallery(GNG)
          </Typography>

          <Typography
            variant="h6"
            component="p"
            align="center"
            color="#00695c"
            sx={{ mb: 4, fontStyle: 'italic', fontWeight: '500' }}
          >
            "প্রতিটি মুদ্রা শুধু একটি সংগ্রহ নয়—এটি ইতিহাসের জীবন্ত অংশ।"
          </Typography>

          <Divider sx={{ mb: 4 }} />

          {/* Introduction */}
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            Gangaridai Numismatic Gallery(GNG) হলো প্রাচীন, বিরল এবং সংগ্রহযোগ্য মুদ্রা কেনা–বেচার জন্য একটি বিশ্বস্ত ও আধুনিক ডিজিটাল মার্কেটপ্লেস।
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
            আমরা সংগ্রাহকদের এমন একটি নির্ভরযোগ্য প্ল্যাটফর্ম দিচ্ছি যেখানে মুদ্রার সত্যতা, গুণমান ও ঐতিহাসিক মূল্যকে সর্বোচ্চ গুরুত্ব দেওয়া হয়।
          </Typography>

          <Grid container spacing={5} alignItems="flex-start">

            {/* Left Column: What We Do */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
                What We Do
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                আমরা সংগ্রাহকদের জন্য একটি নিরাপদ ও সহজ পরিবেশ তৈরি করেছি যেখানে আপনি—
              </Typography>
              <List sx={{ '.MuiListItem-root': { py: 0.5 } }}>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 35, color: '#1b5e20' }}>
                    <CheckCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="বিভিন্ন যুগ ও দেশের বিরল মুদ্রা দেখতে পারবেন" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 35, color: '#1b5e20' }}>
                    <CheckCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="নিরাপদে কেনা–বেচা করতে পারবেন" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 35, color: '#1b5e20' }}>
                    <CheckCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="প্রতিটি মুদ্রার ইতিহাস, উৎপত্তি ও সংগ্রহমূল্য জানতে পারবেন" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 35, color: '#1b5e20' }}>
                    <CheckCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="সংগ্রাহকদের একটি সক্রিয় কমিউনিটির অংশ হতে পারবেন" />
                </ListItem>
              </List>
            </Grid>

            {/* Right Column: Our Mission */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 4, backgroundColor: '#f9fbe7', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
                  <PublicIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Our Mission
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                  আমাদের মিশন হলো বিশ্বব্যাপী সংগ্রাহকদের জন্য একটি **স্বচ্ছ**, **নিরাপদ** এবং **জ্ঞানসমৃদ্ধ** মুদ্রা-বিনিময় প্ল্যাটফর্ম তৈরি করা।
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                  আমরা বিশ্বাস করি—
                </Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#388e3c' }}>
                  "একটি মুদ্রা একটি দেশের ইতিহাস, সংস্কৃতি এবং সময়ের সাক্ষী।"
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Founder Section */}
          <Divider sx={{ my: 6, borderStyle: 'dashed' }} />

          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
              Founder
            </Typography>
            <Avatar
              alt="Rakib"
              src={founderImage}
              imgProps={{
                onError: (e) => { e.currentTarget.src = founderFallback; }
              }}
              sx={{ width: 150, height: 150, margin: 'auto', mb: 2, border: '4px solid #c8e6c9' }}
            />
            <Typography variant="h5" component="h3" sx={{ fontWeight: '600' }}>Rakib</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Founder, Gangaridai Numismatic Gallery(GNG)
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '700px', margin: 'auto', mt: 2 }}>
              সংগ্রাহক ও ইতিহাসপ্রেমী Rakib-এর লক্ষ্য ছিল সংগ্রাহকদের জন্য একটি এমন প্ল্যাটফর্ম তৈরি করা যেখানে তারা সহজে, নিরাপদে এবং আস্থার সাথে মুদ্রা সংগ্রহ করতে পারে।
            </Typography>
          </Grid>

          {/* Why Choose Us Section */}
          <Divider sx={{ my: 6 }} />

          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ fontWeight: 'bold', color: '#004d40' }}>
              Why Choose Us?
            </Typography>
            <Box sx={{ maxWidth: '800px', margin: 'auto' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <List dense>
                    {["নিরাপদ ও যাচাইকৃত সংগ্রহ", "সংগ্রাহকদের জন্য বিশেষজ্ঞ সহায়তা", "পরিষ্কার প্রাইসিং ও স্বচ্ছ লেনদেন"].map((text) => (
                      <ListItem key={text} disablePadding>
                        <ListItemIcon sx={{ minWidth: 35 }}><CheckCircleIcon color="success" /></ListItemIcon>
                        <ListItemText primary={text} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <List dense>
                    {["দ্রুত সার্চ ও আধুনিক ইউজার ইন্টারফেস", "২৪/৭ কাস্টমার সাপোর্ট", "কমিউনিটি ও জ্ঞান ভাগ করে নেওয়ার সুযোগ"].map((text) => (
                      <ListItem key={text} disablePadding>
                        <ListItemIcon sx={{ minWidth: 35 }}><CheckCircleIcon color="success" /></ListItemIcon>
                        <ListItemText primary={text} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default AboutUsPage;