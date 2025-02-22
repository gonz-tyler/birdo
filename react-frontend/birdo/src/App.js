import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from '@mui/material';
import Login from "./pages/Login";
import Home from "./pages/Home";
import ImageUpload from "./pages/ImageUpload";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => (
    <AuthProvider>
        <Router>
            <Container>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/upload" element={<ProtectedRoute element={<ImageUpload />} />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Container>
        </Router>
    </AuthProvider>
);

export default App;