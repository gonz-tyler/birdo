import React from "react";
import { Container, Button, Typography } from '@mui/material';
import { Link } from "react-router-dom";

const Home = () => (
    <Container>
        <Typography variant="h3" gutterBottom>Home Page</Typography>
        <Button variant="contained" color="primary" component={Link} to="/upload">Go to Upload</Button>
    </Container>
);

export default Home;
