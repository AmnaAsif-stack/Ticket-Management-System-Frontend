import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";

import { StripeContext } from "../src/context/StripeContext";
import SubmitFeedback from "./components/Customer/SubmitFeedback";

const App = () => {
  return (
    <StripeContext>
    <Router>
      <Header />
     
     
        <div className="app-layout">
      <main className="main-content">
      <AppRoutes />
     
            <Routes>
            <Route path="/submit-feedback" element={<SubmitFeedback />} />
        
            </Routes>
            
            <Footer />
          </main>
     
      </div>

    </Router>
    
    </StripeContext>

  );
};

export default App;
