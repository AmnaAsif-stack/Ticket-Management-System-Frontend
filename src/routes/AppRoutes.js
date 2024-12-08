import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import Dashboard from "../components/Customer/Dashboard";
import BrowseSchedules from "../components/Customer/Schedules/BrowseSchedules";
import ScheduleDetail from "../components/Customer/Schedules/ScheduleDetail";
import Checkout from '../components/Customer/checkout';
import Profile from "../pages/Profile";
import ErrorPage from "../pages/ErrorPage";
import PassengerManagement from '../pages/PassengerManagement';
import FeedbackPage from "../pages/FeedbackPage";
import CustomerRoutes from "./CustomerRoutes";
const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    
    {/* Customer Panel Routes */}
    <Route path="/Dashboard" element={<Dashboard />} exact />

    <Route path="/checkout" element={<Checkout />} />
    <Route path="/schedules/:id" element={<ScheduleDetail />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/passenger-management" element={<PassengerManagement />} />
    <Route path="/feedback" element={<FeedbackPage />} />

    <Route path="/browse-schedules" element={<BrowseSchedules />} />

    <Route path="*" element={<ErrorPage />} />
    <Route path="/customer/*" element={<CustomerRoutes />} />




  </Routes>
);

export default AppRoutes;
