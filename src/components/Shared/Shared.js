import React from 'react';
import './Shared.css';

export const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-brand">BusEase</div>
    <div className="navbar-links">
      <a href="/">Home</a>
      <a href="/login">Login</a>
      <a href="/signup">Sign Up</a>
      <a href="/about">About</a>
    </div>
  </nav>
);

export const Footer = () => (
  <footer className="footer">
    <p>&copy; 2024 BusEase. All rights reserved.</p>
    <p>Powered by React.</p>
  </footer>
);
