import React, { useState } from "react";
import { Container, Button, Typography, TextField, Box } from '@mui/material';
import axios from "axios";
import useAuthNavigation from "../hooks/useAuthNavigation";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { loginAndNavigate } = useAuthNavigation();

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
        <Container>
            <Box mt={5}>
                <Typography variant="h4" gutterBottom>Login</Typography>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errorMessage && <Typography color="error.main">{errorMessage}</Typography>}
                <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
            </Box>
        </Container>
    );
};

export default Login;
