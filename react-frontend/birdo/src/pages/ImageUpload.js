import React, { useState, useRef } from "react";
import axios from "axios";
import { Container, Button, Typography, Box, TextField, Dialog, DialogActions, Alert, DialogContent, DialogContentText, DialogTitle, Card, CardContent, Grid, LinearProgress, useTheme } from '@mui/material';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { motion } from "framer-motion";
import { Spa, CloudUpload } from '@mui/icons-material';

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [aiResult, setAiResult] = useState(null);
    const [animalInfo, setAnimalInfo] = useState(null);
    const [preview, setPreview] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [metadata, setMetadata] = useState(null);
    const [open, setOpen] = useState(false);
    const [detectedAnimal, setDetectedAnimal] = useState("");
    const [correctAnimal, setCorrectAnimal] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [locationDialogOpen, setLocationDialogOpen] = useState(false);
    const [markerPosition, setMarkerPosition] = useState({ lat: -34.397, lng: 150.644 });
    const [confirmedLocation, setConfirmedLocation] = useState(null);
    const [confirmedCountry, setConfirmedCountry] = useState(null);
    const [mapKey, setMapKey] = useState(0);
    const [insights, setInsights] = useState(null);
    const [insightsLoading, setInsightsLoading] = useState(false);

    const theme = useTheme();
    const fileInputRef = useRef(null);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));

        // Reset state variables for new file selection
        setAiResult(null);
        setAnimalInfo(null);
        setImageUrl(null);
        setSuccessMessage("");
        setErrorMessage("");
        setMetadata(null);
        setDetectedAnimal("");
        setCorrectAnimal("");
        setShowInput(false);
        setConfirmedLocation(null);
        setConfirmedCountry(null);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const selectedFile = event.dataTransfer.files[0];
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));

        // Reset state variables for new file selection
        setAiResult(null);
        setAnimalInfo(null);
        setImageUrl(null);
        setSuccessMessage("");
        setErrorMessage("");
        setMetadata(null);
        setDetectedAnimal("");
        setCorrectAnimal("");
        setShowInput(false);
        setConfirmedLocation(null);
        setConfirmedCountry(null);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleUpload = async () => {
        if (!file) return;
        
        const formData = new FormData();
        formData.append("file", file);
        
        try {
            // Reset state variables for new upload
            setDetectedAnimal("");
            setCorrectAnimal("");
            setShowInput(false);
            setAnimalInfo(null); // Clear previous animal data
            setLoading(true); // Start loading

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
            setAiResult(predictionResponse.data);

            // Extract detected animal species
            const species = predictionResponse.data.split(",")[0].replace(/_/g, " ");

            setDetectedAnimal(species);
            setOpen(true); // Open the dialog to confirm the detected animal
        } catch (error) {
            console.error("Error uploading file:", error);
            setErrorMessage("Failed to upload image. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleConfirm = async () => {
        setOpen(false);
        try {
            const species = showInput ? correctAnimal : detectedAnimal;
            // Fetch animal info based on species
            const adjustedSpecies = species === "grey fox" ? "gray fox" : species === "African elephant" ? "elephant" : species;
            const animalInfoResponse = await axios.post("http://localhost:5000/animal-info", {
                species: adjustedSpecies
            });
            
            // Assuming the response is an array of matches, take the first match
            const firstMatch = animalInfoResponse.data[0];
            setAnimalInfo(firstMatch); 
            setMarkerPosition({ lat: -34.397, lng: 150.644 }); // Reset marker position
            setLocationDialogOpen(true); // Open the location dialog
        } catch (error) {
            console.error("Error fetching animal info:", error);
            setErrorMessage("Failed to fetch animal info. Please try again.");
        }
    };

    const handleLocationConfirm = async () => {
        setLocationDialogOpen(false);
        setConfirmedLocation(markerPosition); // Store the confirmed location

        // Reverse geocode to get the country name
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: markerPosition }, async (results, status) => {
            if (status === "OK" && results[0]) {
                const country = results[0].address_components.find(component =>
                    component.types.includes("country")
                );
                if (country) {
                    setConfirmedCountry(country.long_name);

                    // Save data to backend
                    const dataToSave = {
                        animal: correctAnimal || detectedAnimal,
                        species: animalInfo.name,
                        location: country.long_name,
                        quantity: 1, // Example quantity, you can change this
                        coordinates: [markerPosition.lat, markerPosition.lng]
                    };

                    try {
                        await axios.post("http://localhost:5000/save-data", dataToSave);
                        console.log("Data saved successfully");
                    } catch (error) {
                        console.error("Error saving data:", error);
                        setErrorMessage("Failed to save data. Please try again.");
                    }
                }
            } else {
                console.error("Geocode was not successful for the following reason: " + status);
            }
        });

        // Handle the confirmed location (e.g., send it to the backend)
        console.log("Confirmed location:", markerPosition);
    };

    const handleMapClick = (event) => {
        setMarkerPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    };

    const handleGetInsights = async () => {
        if (!animalInfo?.name) return;
        
        setInsightsLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/get-insights", {
                species: animalInfo.name
            });
            
            // Split the response into sections
            const sections = response.data.split('\n\n');
            const parsedInsights = {};
            
            sections.forEach(section => {
                const [title, content] = section.split(':\n');
                if (title && content) {
                    parsedInsights[title.trim()] = content.replace(/"/g, '').trim();
                }
            });
            
            setInsights(parsedInsights);
            setErrorMessage("");
        } catch (error) {
            console.error("Error fetching insights:", error);
            setErrorMessage("Failed to fetch insights. Please try again.");
        } finally {
            setInsightsLoading(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleNo = () => {
        setShowInput(true);
    };

    const renderAnimalInfo = (info) => {
        if (!info) return null;

        const { characteristics, locations, name, taxonomy } = info;

        return (
            <Box mt={2}>
                <Typography variant="h6">Animal Information</Typography>
                <Grid container spacing={2}>
                    {name && (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">{name}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                    {characteristics && Object.entries(characteristics).map(([key, value]) => (
                        <Grid item xs={12} sm={6} md={4} key={key}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{key.replace(/_/g, ' ')}</Typography>
                                    <Typography variant="body2">{value}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {locations && (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Locations</Typography>
                                    <Typography variant="body2">{locations.join(', ')}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                    {taxonomy && Object.entries(taxonomy).map(([key, value]) => (
                        <Grid item xs={12} sm={6} md={4} key={key}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{key.replace(/_/g, ' ')}</Typography>
                                    <Typography variant="body2">{value}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    const renderInsights = () => {
        if (!insights) return null;
        
        const insightSections = [
            "Population Trend",
            "Migration Pattern",
            "Human Impact Alert",
            "Optimal Spotting Times/Locations"
        ];

        return (
            <Box mt={4}>
                <Typography variant="h5" gutterBottom>Conservation Insights</Typography>
                <Grid container spacing={3}>
                    {insightSections.map((section) => (
                        <Grid item xs={12} md={6} key={section}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        {section}
                                    </Typography>
                                    <Typography variant="body2">
                                        {insights[section] || "No information available"}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

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
                            Upload an Image
                        </Typography>

                        <Box mt={4}>
                            <Box
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => fileInputRef.current.click()}
                                sx={{
                                    border: '2px dashed #2e7d32',
                                    borderRadius: 2,
                                    padding: 3,
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    backgroundColor: '#f1f8e9',
                                    '&:hover': { backgroundColor: '#e8f5e9' }
                                }}
                            >
                                <CloudUpload sx={{ fontSize: 50, color: '#2e7d32' }} />
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    Drag & Drop an image here or click to select a file
                                </Typography>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    style={{ display: 'none' }}
                                />
                            </Box>
                            {preview && (
                                <Box 
                                    component="img" 
                                    src={preview} 
                                    alt="Preview" 
                                    sx={{ 
                                        width: '100%', 
                                        maxWidth: '300px', 
                                        borderRadius: 2, 
                                        mb: 2 
                                    }} 
                                />
                            )}
                            <Button 
                                variant="contained" 
                                color="success" 
                                onClick={handleUpload}
                                sx={{
                                    borderRadius: 50,
                                    px: 6,
                                    py: 1.5,
                                    fontSize: '1.2rem',
                                    textTransform: 'none',
                                    boxShadow: theme.shadows[4]
                                }}
                            >
                                Upload
                            </Button>
                            {loading && <LinearProgress sx={{ mt: 2 }} />}
                            {successMessage && (
                                <Typography color="success.main" sx={{ mt: 2 }}>
                                    {successMessage}
                                </Typography>
                            )}
                            {errorMessage && (
                                <Typography color="error.main" sx={{ mt: 2 }}>
                                    {errorMessage}
                                </Typography>
                            )}
                        </Box>

                        {renderAnimalInfo(animalInfo)}

                        {animalInfo && (
                            <Box mt={3} mb={4}>
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    onClick={handleGetInsights}
                                    disabled={insightsLoading}
                                    sx={{
                                        borderRadius: 50,
                                        px: 6,
                                        py: 1.5,
                                        fontSize: '1.2rem',
                                        textTransform: 'none',
                                        boxShadow: theme.shadows[4]
                                    }}
                                >
                                    {insightsLoading ? "Generating Insights..." : "Get Conservation Insights"}
                                </Button>
                                {insightsLoading && <LinearProgress sx={{ mt: 1 }} />}
                            </Box>
                        )}
                        
                        {insights && renderInsights()}

                        <Dialog open={open} onClose={handleCancel}>
                            <DialogTitle>Confirm Detected Animal</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Is the detected animal "{detectedAnimal}" correct?
                                </DialogContentText>
                                {showInput && (
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        label="Correct Animal"
                                        type="text"
                                        fullWidth
                                        value={correctAnimal}
                                        onChange={(e) => setCorrectAnimal(e.target.value)}
                                    />
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCancel} color="primary">Cancel</Button>
                                <Button onClick={handleNo} color="primary">No</Button>
                                <Button onClick={handleConfirm} color="primary">Yes</Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog open={locationDialogOpen} onClose={() => setLocationDialogOpen(false)} maxWidth="lg" fullWidth>
                            <DialogTitle>Select Location</DialogTitle>
                            <DialogContent>
                            {isLoaded ? (
                                    <GoogleMap
                                        mapContainerStyle={{ height: "400px", width: "100%" }}
                                        center={markerPosition}
                                        zoom={8}
                                        onClick={handleMapClick}
                                    >
                                        <Marker position={markerPosition} />
                                    </GoogleMap>
                                ) : (
                                    <div>Loading map...</div>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setLocationDialogOpen(false)} color="primary">Cancel</Button>
                                <Button onClick={handleLocationConfirm} color="primary">Confirm</Button>
                            </DialogActions>
                        </Dialog>
                    </Card>
                </motion.div>
            </Container>
        </Box>
    );
};

export default ImageUpload;