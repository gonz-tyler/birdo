import React from "react";
import { Box, Typography, Button, Container, Grid, Card, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Nature, Upload, Analytics, Grass } from '@mui/icons-material';
import { Spa } from '@mui/icons-material';

const LearnMore = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <Upload sx={{ fontSize: 50 }} />,
      title: "Simple Upload",
      text: "Effortlessly submit your environmental observations through our secure platform"
    },
    {
      icon: <Analytics sx={{ fontSize: 50 }} />,
      title: "Real-time Analytics",
      text: "Watch your impact grow with our dynamic data visualization tools"
    },
    {
      icon: <Nature sx={{ fontSize: 50 }} />,
      title: "Eco Tracking",
      text: "Get actionable insights about the animals you track"
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #e8f5e9, #c8e6c9)',
        py: 8,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated floating leaves */}
      <Box sx={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Spa sx={{ fontSize: 40, color: '#2e7d32', opacity: 0.3 }} />
          </motion.div>
        ))}
      </Box>

      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            <Box sx={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)' }}>
              <Spa sx={{ fontSize: 80, color: '#2e7d32' }} />
            </Box>

            <Typography
              variant="h2"
              sx={{
                mt: 4,
                fontWeight: 800,
                color: '#1b5e20',
                textAlign: 'center',
                position: 'relative',
                '&:after': {
                  content: '""',
                  display: 'block',
                  width: 100,
                  height: 4,
                  backgroundColor: theme.palette.success.main,
                  margin: '20px auto',
                  borderRadius: 2
                }
              }}
            >
              Cultivate Change
            </Typography>

            <Typography variant="h5" sx={{ textAlign: 'center', mb: 6, color: '#616161' }}>
              Your Gateway to Environmental Stewardship
            </Typography>

            <Grid container spacing={6} sx={{ mb: 8 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div whileHover={{ y: -10 }}>
                    <Card
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(5px)'
                      }}
                    >
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <motion.div whileHover={{ rotate: 20 }}>
                          {feature.icon}
                        </motion.div>
                      </Box>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1b5e20' }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{ color: '#616161' }}>
                        {feature.text}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Interactive Guide */}
            <Box sx={{ 
              background: 'linear-gradient(45deg, #e8f5e9 30%, #c8e6c9 90%)',
              borderRadius: 4,
              p: 4,
              mb: 6,
              position: 'relative'
            }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#1b5e20' }}>
                How It Works
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 4
              }}>
                {[1, 2, 3].map((step) => (
                  <motion.div 
                    key={step} 
                    whileHover={{ scale: 1.05 }}
                    style={{ flex: 1, minWidth: 250 }}
                  >
                    <Box sx={{
                      bgcolor: 'white',
                      p: 3,
                      borderRadius: 3,
                      height: '100%',
                      boxShadow: theme.shadows[2]
                    }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        bgcolor: theme.palette.success.main,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                      }}>
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          {step}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ mb: 1, color: '#1b5e20' }}>
                        Step {step}
                      </Typography>
                      <Typography sx={{ color: '#616161' }}>
                        {[
                          "Create your free environmental account",
                          "Upload your wildlife observations",
                          "Track global impact in real-time"
                        ][step - 1]}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  component={Link}
                  to="/upload"
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<Grass />}
                  sx={{
                    borderRadius: 50,
                    px: 6,
                    py: 1.5,
                    fontSize: '1.2rem',
                    textTransform: 'none',
                    boxShadow: theme.shadows[4]
                  }}
                >
                  Start Your Journey
                </Button>
              </motion.div>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LearnMore;