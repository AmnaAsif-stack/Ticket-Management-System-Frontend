import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/newlogo.png";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src={logo} alt="EasyBus Logo" />
        </Link>
        <nav className={`header-nav ${isMenuOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/feedback" className="nav-link">Feedback</Link>

        </nav>
        <div className="desktop-buttons">
          <Link to="/login" className="header-button login">Login</Link>
          <Link to="/signup" className="header-button signup">Signup</Link>
        </div>
        <button className={`menu-toggle ${isMenuOpen ? "open" : ""}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
