import React, { useState } from "react";
import { Box, Button, Typography, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useAuthNavigation from "../hooks/useAuthNavigation";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useMediaQuery } from '@mui/material';
import { Spa } from '@mui/icons-material';

const Navbar = () => {
  const { user } = useAuth();
  const { logoutAndNavigate } = useAuthNavigation();
  
  // State to control the drawer (hamburger menu)
  const [openDrawer, setOpenDrawer] = useState(false);

  // Check if the screen size is small (mobile)
  const isMobile = useMediaQuery('(max-width:600px)');

  // Toggle the drawer open/close
  const toggleDrawer = (open) => {
    setOpenDrawer(open);
  };

const mobileMenu = (
    <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => toggleDrawer(false)}
    >
        <Box sx={{ width: 250, padding: 2 }}>
            <IconButton onClick={() => toggleDrawer(false)} sx={{ mb: 2 }}>
                <CloseIcon />
            </IconButton>
            <List>
                <ListItem button component={Link} to="/" onClick={() => toggleDrawer(false)} sx={{ color: 'inherit', '&.Mui-selected': { backgroundColor: 'transparent' } }}>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/upload" onClick={() => toggleDrawer(false)} sx={{ color: 'inherit', '&.Mui-selected': { backgroundColor: 'transparent' } }}>
                    <ListItemText primary="Upload" />
                </ListItem>
                <ListItem button component={Link} to="/data" onClick={() => toggleDrawer(false)} sx={{ color: 'inherit', '&.Mui-selected': { backgroundColor: 'transparent' } }}>
                    <ListItemText primary="Data" />
                </ListItem>
                <ListItem button component={Link} to="/learn-more" onClick={() => toggleDrawer(false)} sx={{ color: 'inherit', '&.Mui-selected': { backgroundColor: 'transparent' } }}>
                    <ListItemText primary="Learn More" />
                </ListItem>
                {user ? (
                    <ListItem button onClick={() => { logoutAndNavigate(); toggleDrawer(false); }} sx={{ color: 'inherit', '&.Mui-selected': { backgroundColor: 'transparent' } }}>
                        <ListItemText primary="Logout" />
                    </ListItem>
                ) : (
                    <ListItem button component={Link} to="/login" onClick={() => toggleDrawer(false)} sx={{ color: 'inherit', '&.Mui-selected': { backgroundColor: 'transparent' } }}>
                        <ListItemText primary="Login" />
                    </ListItem>
                )}
            </List>
        </Box>
    </Drawer>
);

return (
    <Box
        component="nav"
        sx={{
            background: 'linear-gradient(to bottom right, #e8f5e9, #c8e6c9)',
            py: 2,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1b5e20', display: 'flex', alignItems: 'center' }}>
                <Spa sx={{ fontSize:50 }} />
                Birdo
            </Typography>

            {/* Desktop Menu */}
            {!isMobile && (
                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Button component={Link} to="/" color="inherit" sx={{ textTransform: 'none', fontSize: '1.1rem' }}>
                        Home
                    </Button>
                    <Button component={Link} to="/upload" color="inherit" sx={{ textTransform: 'none', fontSize: '1.1rem' }}>
                        Upload
                    </Button>
                    <Button component={Link} to="/data" color="inherit" sx={{ textTransform: 'none', fontSize: '1.1rem' }}>
                        Data
                    </Button>
                    <Button component={Link} to="/learn-more" color="inherit" sx={{ textTransform: 'none', fontSize: '1.1rem' }}>
                        Learn More
                    </Button>
                    {user ? (
                        <Button onClick={logoutAndNavigate} color="inherit" sx={{ textTransform: 'none', fontSize: '1.1rem' }}>
                            Logout
                        </Button>
                    ) : (
                        <Button component={Link} to="/login" color="inherit" sx={{ textTransform: 'none', fontSize: '1.1rem' }}>
                            Login
                        </Button>
                    )}
                </Box>
            )}

            {/* Hamburger Icon for Mobile */}
            {isMobile && (
                <IconButton onClick={() => toggleDrawer(true)} color="inherit">
                    <MenuIcon />
                </IconButton>
            )}
        </Box>

        {/* Mobile Menu (Drawer) */}
        {mobileMenu}
    </Box>
);
};

export default Navbar;