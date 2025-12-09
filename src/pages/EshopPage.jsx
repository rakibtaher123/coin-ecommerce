import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const EshopPage = () => {
  const navigate = useNavigate();

  // ✅ ডাটাবেসের সাথে মিল রেখে সঠিক ক্যাটাগরি এবং ফোল্ডার নেম
  const categories = [
    { name: "Janapada Series", folder: "janapada_series" },
    { name: "Ancient Bengal", folder: "ancient_bengal" },
    { name: "Medieval Bengal", folder: "medieval_bengal" },
    { name: "Sultanate Period", folder: "sultanate_period" },
    { name: "Mughal Empire", folder: "mughal_empire" },
    { name: "East India Company", folder: "east_india_company" },
    { name: "British Indian Coins", folder: "british_indian_coins" },
    { name: "British Indian Notes", folder: "british_indian_notes" },
    { name: "Pakistani Coins", folder: "pakistani_coins" },
    { name: "Pakistani Notes", folder: "pakistani_notes" },
    { name: "Bangladeshi Republic Coins", folder: "bd_republic_coins" },
    { name: "Bangladeshi Republic Notes", folder: "bd_republic_notes" }
  ];

  // ✅ ক্লিক হ্যান্ডলার
  const handleCategoryClick = (folderName) => {
    navigate(`/category/${folderName}`);
  };
  
  // ✅ সব প্রোডাক্টের লিঙ্কে যাওয়ার হ্যান্ডলার
  const handleBrowseAllClick = () => {
    // এইখানে আপনাকে আপনার 'সব প্রোডাক্ট' পেজের সঠিক রাউটটি দিতে হবে।
    // যদি রাউটটি /all-products হয়, তবে এটি ঠিক আছে।
    navigate('/all-products'); 
    console.log("Navigating to all products page."); // কনসোল লগ যোগ করা হয়েছে
  };


  return (
    <Box sx={{ py: 8, backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{ 
              fontWeight: '800', 
              color: '#00796b', 
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Coins by Eras & Civilizations
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', maxWidth: '700px', mx: 'auto', fontSize: '1.2rem' }}>
            Explore our vast collection of numismatic history ranging from ancient civilizations to modern republics.
          </Typography>
          <Box sx={{ width: '100px', height: '5px', bgcolor: '#009688', mx: 'auto', mt: 3, borderRadius: '2px' }} /> 
        </Box>

        {/* Category Container */}
        <Paper 
            elevation={0} 
            sx={{ 
                p: { xs: 3, md: 6 }, 
                borderRadius: 4, 
                backgroundColor: 'white',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                border: '1px solid #e0f2f1' 
            }}
        >
            <Typography variant="h4" sx={{ mb: 5, fontWeight: '700', color: '#00695c', textAlign: 'center' }}> 
                Select a Historical Era
            </Typography>
            
            <Grid container spacing={3}>
            {categories.map((cat, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper 
                    elevation={4}
                    onClick={() => handleCategoryClick(cat.folder)}
                    sx={{ 
                      p: 4, 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      backgroundColor: '#00796b', 
                      background: 'linear-gradient(135deg, #00796b 30%, #004d40 90%)', 
                      color: 'white', 
                      cursor: 'pointer',
                      borderRadius: '16px',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 15px 30px rgba(0, 121, 107, 0.4)', 
                          background: 'linear-gradient(135deg, #004d40 30%, #00251a 90%)', 
                      }
                    }}
                >
                    <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: '700', 
                          fontSize: '1.25rem', 
                          letterSpacing: '0.5px'
                        }}
                    >
                      {cat.name}
                    </Typography>
                    
                    <Box 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        borderRadius: '50%', 
                        p: 1, 
                        display: 'flex' 
                      }}
                    >
                      <ArrowForwardIosIcon 
                          fontSize="small" 
                          sx={{ color: 'white' }} 
                      />
                    </Box>
                </Paper>
                </Grid>
            ))}
            </Grid>

            {/* View All Button */}
            <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Button 
                    variant="contained" 
                    size="large"
                    onClick={handleBrowseAllClick} 
                    sx={{ 
                        bgcolor: '#ff5722', 
                        px: 7,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        textTransform: 'none',
                        boxShadow: '0 10px 20px rgba(255, 87, 34, 0.4)', 
                        '&:hover': { 
                            bgcolor: '#e64a19', 
                            transform: 'scale(1.05)',
                            boxShadow: '0 15px 30px rgba(230, 74, 25, 0.5)' 
                        },
                        transition: 'all 0.3s'
                    }}
                >
                    Browse Complete Collection
                </Button>
            </Box>
        </Paper>

      </Container>
    </Box>
  );
};

export default EshopPage;
