import React, { useState } from "react";
import axios from "axios";
import { Container, Button, Typography, Box, TextField } from '@mui/material';

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [aiResult, setAiResult] = useState(null);
    const [animalInfo, setAnimalInfo] = useState(null);
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
            const predictionResponse = await axios.post("http://localhost:5000/classify-animal", {
                image_url: uploadedImageUrl
            });
            setAiResult(predictionResponse.data)

            // Fetch animal info based on species
            const species = predictionResponse.data.split(",")[0].replace(/_/g, " ");
            // Hardcoded checks for specific species
            const adjustedSpecies = species === "grey fox" ? "gray fox" : species === "African elephant" ? "African Bush elephant" : species;
            console.log(adjustedSpecies)

            // Fetch animal info based on adjusted species
            const animalInfoResponse = await axios.post("http://localhost:5000/animal-info", {
                species: adjustedSpecies
            });
            
            setAnimalInfo(animalInfoResponse.data); 
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
            {animalInfo && ( // Display animal info if available
                <Box mt={2}>
                    <Typography variant="h6">Animal Information:</Typography>
                    <pre>{JSON.stringify(animalInfo, null, 2)}</pre>
                </Box>
            )}
        </Container>
    );
};

export default ImageUpload;
