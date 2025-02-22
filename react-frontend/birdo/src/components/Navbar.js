import React from "react";
import { Box, Button } from '@mui/material';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useAuthNavigation from "../hooks/useAuthNavigation";


const Navbar = () => {
    const { user } = useAuth();
    const { logoutAndNavigate } = useAuthNavigation();

    return (
        <Box component="nav" mb={2}>
            <Button component={Link} to="/" color="inherit">Home</Button>
            <Button component={Link} to="/upload" color="inherit">Upload</Button>
            <Button component={Link} to="/data" color="inherit">Data</Button>
            {user ? (
                <Button onClick={logoutAndNavigate} color="inherit">Logout</Button>
            ) : (
                <Button component={Link} to="/login" color="inherit">Login</Button>
            )}
        </Box>
    );
};

export default Navbar;
