import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import Dashboard from "../components/Customer/Dashboard";
import BrowseRoutes from "../components/Customer/Routes/BrowseRoutes";
import BrowseSchedules from "../components/Customer/Schedules/BrowseSchedules";
import ScheduleDetail from "../components/Customer/Schedules/ScheduleDetail";
import BookTicket from "../components/Tickets/BookTicket";
import ManageTickets from "../components/Tickets/ManageTickets";
import PaymentPage from "../components/Payment/PaymentPage";
import Checkout from "../components/Payment/Checkout";
import Profile from "../pages/Profile";
import ErrorPage from "../pages/ErrorPage";
import PassengerManagement from '../pages/PassengerManagement';
import FeedbackPage from "../pages/FeedbackPage";
import TravelHistory from "../components/Customer/TravelHistory";
import CustomerRoutes from "./CustomerRoutes";
const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    
    {/* Customer Panel Routes */}
    <Route path="/Dashboard" element={<Dashboard />} exact />
    <Route path="/routes" element={<BrowseRoutes />} />
    <Route path="/schedules/:id" element={<ScheduleDetail />} />
    <Route path="/book-ticket" element={<BookTicket />} />
    <Route path="/manage-tickets" element={<ManageTickets />} />
    <Route path="/payment" element={<PaymentPage />} />
    <Route path="/checkout/:id" element={<Checkout />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/passenger-management" element={<PassengerManagement />} />
    <Route path="/feedback" element={<FeedbackPage />} />
    <Route path="/travel-history" element={<TravelHistory />} />

    <Route path="/browse-schedules" element={<BrowseSchedules />} />
   
    <Route path="*" element={<ErrorPage />} />
    <Route path="/customer/*" element={<CustomerRoutes />} />




  </Routes>
);

export default AppRoutes;
