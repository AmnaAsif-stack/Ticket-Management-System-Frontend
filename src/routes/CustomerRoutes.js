import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

// Import authentication components
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";

// Import customer dashboard and other customer-related components
import Dashboard from "../components/Customer/Dashboard"; 
import Checkout from "../components/Payment/Checkout";

const CustomerRoutes = () => {
    const navigate = useNavigate();

    const handleLogin = async (credentials) => {
        try {
            const response = await axios.post("http://localhost:5000/api/login", credentials);
            // Save token or session info
            localStorage.setItem("token", response.data.token);
            navigate("/Dashboard");
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleSignup = async (userData) => {
        try {
            await axios.post("http://localhost:5000/api/signup", userData);
            navigate("/login");
        } catch (error) {
            console.error("Signup error:", error);
        }
    };

    return (
        <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onSignup={handleSignup} />} />

            {/* Customer Dashboard */}
            <Route path="/Dashboard" element={<Dashboard />} />

            {/* Route Browsing and Ticket Booking */}
         

            {/* Payment Processing */}
        </Routes>
    );
};

export default CustomerRoutes;
