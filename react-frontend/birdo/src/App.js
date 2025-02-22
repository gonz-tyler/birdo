import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { Container, Button, Typography, Box, TextField } from '@mui/material';
import Login from "./pages/Login";

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [aiResult, setAiResult] = useState(null);
    const [preview, setPreview] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [metadata, setMetadata] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleUpload = async () => {
        if (!file) return;
        
        const formData = new FormData();
        formData.append("file", file);
        
        try {
            // Upload image to Flask backend
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            const uploadedImageUrl = response.data.imageUrl;
            setImageUrl(uploadedImageUrl);
            setMetadata(response.data.metadata);
            setSuccessMessage("Image uploaded successfully!");
            setErrorMessage("");
        } catch (error) {
            console.error("Error uploading file:", error);
            setErrorMessage("Failed to upload image. Please try again.");
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Upload an Image</Typography>
            <TextField type="file" onChange={handleFileChange} fullWidth margin="normal" />
            {preview && <Box component="img" src={preview} alt="Preview" width="200px" />}
            <Button variant="contained" color="primary" onClick={handleUpload}>Upload</Button>
            {successMessage && <Typography color="success.main">{successMessage}</Typography>}
            {errorMessage && <Typography color="error.main">{errorMessage}</Typography>}
            {imageUrl && <Typography>Image URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></Typography>}
            {metadata && (
                <Box mt={2}>
                    <Typography variant="h6">Image Metadata:</Typography>
                    <pre>{JSON.stringify(metadata, null, 2)}</pre>
                    {metadata.location && (
                        <Typography variant="body1">Location: {metadata.location}</Typography>
                    )}
                </Box>
            )}
            {aiResult && (
                <Box mt={2}>
                    <Typography variant="h6">AI Result:</Typography>
                    <pre>{JSON.stringify(aiResult, null, 2)}</pre>
                </Box>
            )}
        </Container>
    );
};

const Home = () => (
    <Container>
        <Typography variant="h3" gutterBottom>Home Page</Typography>
        <Button variant="contained" color="primary" component={Link} to="/upload">Go to Upload</Button>
    </Container>
);

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if the user is authenticated
        const checkAuth = async () => {
            try {
                const response = await axios.get("http://localhost:5000/check-auth");
                setIsAuthenticated(response.data.isAuthenticated);
            } catch (error) {
                console.error("Error checking authentication:", error);
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <Router>
            <Container>
                <Box component="nav" mb={2}>
                    <Button component={Link} to="/" color="inherit">Home</Button>
                    <Button component={Link} to="/upload" color="inherit">Upload</Button>
                    <Button component={Link} to="/login" color="inherit">Login</Button>
                </Box>
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/upload" element={isAuthenticated ? <ImageUpload /> : <Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
