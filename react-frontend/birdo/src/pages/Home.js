import React from "react";
import { Container, Button, Typography, Card, Box, Grid } from '@mui/material';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Spa, Grass, Park } from '@mui/icons-material';

const Home = () => (
  <Box
    sx={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #e8f5e9, #c8e6c9)',
      py: 8
    }}
  >
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
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
            variant="h3" 
            gutterBottom 
            sx={{ 
              mt: 4,
              fontWeight: 700,
              color: '#1b5e20',
              textAlign: 'center',
              '&:after': {
                content: '""',
                display: 'block',
                width: 60,
                height: 4,
                backgroundColor: '#81c784',
                margin: '16px auto'
              }
            }}
          >
            Birdo
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              color: '#616161',
              textAlign: 'center',
              mb: 4,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Join us in creating a sustainable future through conscious environmental actions and community-driven initiatives.
          </Typography>

          <Grid container spacing={3} justifyContent="center" sx={{ mb: 2 }}>
            <Grid item>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="contained"
                  color="success"
                  component={Link}
                  to="/upload"
                  size="large"
                  startIcon={<Grass />}
                  sx={{
                    borderRadius: 50,
                    px: 4,
                    py: 1,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  Start Uploading
                </Button>
              </motion.div>
            </Grid>
            <Grid item>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/learn-more"
                  color="success"
                  size="large"
                  startIcon={<Park />}
                  sx={{
                    borderRadius: 50,
                    px: 4,
                    py: 1,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  Learn More
                </Button>
              </motion.div>
            </Grid>
          </Grid>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4,
            gap: 2,
            opacity: 0.8
          }}>
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: item * 0.5
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: '#a5d6a7'
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </Card>
      </motion.div>
    </Container>
  </Box>
);

export default Home;