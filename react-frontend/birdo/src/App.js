import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from '@mui/material';  // Changed from Container
import Login from "./pages/Login";
import Home from "./pages/Home";
import ImageUpload from "./pages/ImageUpload";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Data from "./pages/Data";
import LearnMore from "./pages/LearnMore";

const App = () => (
  <AuthProvider>
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<ProtectedRoute element={<ImageUpload />} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/data" element={<Data />} />
            <Route path="/learn-more" element={<LearnMore />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  </AuthProvider>
);

export default App;