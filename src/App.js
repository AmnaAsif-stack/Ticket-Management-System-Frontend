import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import TicketBooking from "./components/Tickets/BookTicket";

import { StripeContext } from "../src/context/StripeContext";
import Checkout from "../src/components/Payment/Checkout";
import Dashboard from "../src/components/Customer/Dashboard";
import PassengerManagement from './pages/PassengerManagement'; // Make sure to import the page
import FeedbackPage from './pages/FeedbackPage'; // Import FeedbackPage component



const App = () => {
  return (
    <StripeContext>
    <Router>
      <Header />
     
     
        <div className="app-layout">
      <main className="main-content">
      <AppRoutes />
     
            <Routes>
            <Route path="/ticket-booking" element={<TicketBooking />} />
              <Route path="/checkout/:bookingId" element={<Checkout />} />

            </Routes>
            
            <Footer />
          </main>
     
      </div>

    </Router>
    
    </StripeContext>

  );
};

export default App;
