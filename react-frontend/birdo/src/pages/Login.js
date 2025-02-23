import React, { useState, useEffect } from "react";
import { Button, Typography, TextField, Box, Card, useMediaQuery, Link as MuiLink } from '@mui/material';
import axios from "axios";
import useAuthNavigation from "../hooks/useAuthNavigation";
import { motion } from "framer-motion";
import { Spa, Grass } from '@mui/icons-material';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { loginAndNavigate } = useAuthNavigation();

    const isMobile = useMediaQuery("(max-width: 600px)");

    // Prevent body scrolling issue
    useEffect(() => {
        document.body.style.overflowX = "hidden";
        return () => { document.body.style.overflowX = "auto"; };
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5000/login", { email, password });
            if (response.data.success) {
                loginAndNavigate({ email });
            } else {
                setErrorMessage("Invalid email or password");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setErrorMessage("Failed to log in. Please try again.");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "linear-gradient(to bottom right, #e8f5e9, #c8e6c9)",
                padding: isMobile ? 0 : 4, // Remove padding on mobile for full-screen effect
                maxWidth: "100vw", // Prevents overflow
                overflow: "hidden", // Hides any unexpected overflow
                pt: isMobile ? 2 : 4, // Adjust padding-top to move the component up
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    width: "100%",
                    maxWidth: isMobile ? "100%" : "400px",
                    padding: isMobile ? 0 : "16px", // Remove padding on mobile
                     // Ensure padding is included in the width
                    marginTop: isMobile ? "-60%" : "-20%"
                    }}
            >
                <Card
                    sx={{
                        p: isMobile ? 2 : 4, // Adjust padding for mobile
                        borderRadius: isMobile ? 0 : 4, // Remove border radius for full-screen look
                        boxShadow: isMobile ? "none" : "0 8px 32px rgba(0,0,0,0.1)",
                        background: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                        width: "100%",
                        textAlign: "center",
                        height: isMobile ? "auto" : "auto", // Adjust height on mobile
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center", // Center internal components
                        position: "relative",
                        overflow: "visible", // Ensure nothing gets cut off
                        margin: "0 auto", // Center the card horizontally
                        boxSizing: "border-box", // Ensure padding is included in the width
                    }}
                >
                    {/* Floating Icon */}
                    <Box sx={{ 
                        position: 'absolute', 
                        top: -40, 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        zIndex: 1, // Ensure the icon is above the card
                    }}>
                        <Spa sx={{ fontSize: 60, color: '#2e7d32', opacity: 1.0 }} />
                    </Box>

                    <Typography 
                        variant="h4" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 700,
                            color: "#1b5e20",
                            textAlign: "center",
                            fontSize: isMobile ? "1.5rem" : "2rem",
                            "&:after": {
                                content: '""',
                                display: "block",
                                width: 60,
                                height: 4,
                                backgroundColor: "#81c784",
                                margin: "16px auto",
                            },
                        }}
                    >
                        Login
                    </Typography>

                    <Box sx={{ width: isMobile ? "80%" : "100%", textAlign: "center" }}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                fontSize: isMobile ? "0.9rem" : "1rem",
                                marginBottom: isMobile ? "10px" : "16px",
                            }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                fontSize: isMobile ? "0.9rem" : "1rem",
                                marginBottom: isMobile ? "10px" : "16px",
                            }}
                        />

                        {errorMessage && (
                            <Typography color="error" sx={{ mt: 1 }}>
                                {errorMessage}
                            </Typography>
                        )}

                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Button 
                                variant="contained" 
                                color="success" 
                                fullWidth 
                                onClick={handleLogin}
                                sx={{
                                    mt: 3,
                                    borderRadius: 50,
                                    px: 4,
                                    py: 1,
                                    textTransform: "none",
                                    fontSize: isMobile ? "0.9rem" : "1.1rem",
                                }}
                                startIcon={<Grass />}
                            >
                                Login
                            </Button>
                        </motion.div>

                        <Typography sx={{ mt: 2, color: "#616161" }}>
                            Don't have an account?{" "}
                            <MuiLink href="/register" color="success" underline="hover">
                                Register here
                            </MuiLink>
                        </Typography>
                    </Box>
                </Card>
            </motion.div>
        </Box>
    );
};

export default Login;