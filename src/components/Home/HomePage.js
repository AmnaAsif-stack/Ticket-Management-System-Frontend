import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import Navbar from '../Shared/Navbar';
import Footer from '../Shared/Footer';
import './HomePage.css';

const HomePage = () => (
  <>
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <Footer />
  </>
);

export default HomePage;
