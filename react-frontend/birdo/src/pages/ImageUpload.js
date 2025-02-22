import React, { useState } from "react";
import axios from "axios";
import { Container, Button, Typography, Box, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardContent, Grid, LinearProgress } from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

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
            const animalInfoResponse = await axios.post("http://localhost:5000/animal-info", {
                species: species
            });
            
            // Assuming the response is an array of matches, take the first match
            const firstMatch = animalInfoResponse.data[0];
            setAnimalInfo(firstMatch); 
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
        geocoder.geocode({ location: markerPosition }, (results, status) => {
            if (status === "OK" && results[0]) {
                const country = results[0].address_components.find(component =>
                    component.types.includes("country")
                );
                if (country) {
                    setConfirmedCountry(country.long_name);
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

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Upload an Image</Typography>
            <TextField type="file" onChange={handleFileChange} fullWidth margin="normal" />
            {preview && <Box component="img" src={preview} alt="Preview" width="200px" />}
            {confirmedLocation && (
                <Box mt={2}>
                    <Typography variant="h6">Confirmed Location</Typography>
                    <Typography variant="body1">Latitude: {confirmedLocation.lat}</Typography>
                    <Typography variant="body1">Longitude: {confirmedLocation.lng}</Typography>
                    {confirmedCountry && <Typography variant="body1">Country: {confirmedCountry}</Typography>}
                </Box>
            )}
            <Button variant="contained" color="primary" onClick={handleUpload}>Upload</Button>
            {loading && <LinearProgress />}
            {successMessage && <Typography color="success.main">{successMessage}</Typography>}
            {errorMessage && <Typography color="error.main">{errorMessage}</Typography>}
            {renderAnimalInfo(animalInfo)}

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
                    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                        <GoogleMap
                            mapContainerStyle={{ height: "400px", width: "100%" }}
                            center={markerPosition}
                            zoom={8}
                            onClick={handleMapClick}
                        >
                            <Marker position={markerPosition} />
                        </GoogleMap>
                    </LoadScript>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLocationDialogOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleLocationConfirm} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ImageUpload;