import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Shared.css';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">BusEase</Link>
      <div className="navbar-links">
        {user ? (
          <span>Welcome, {user.email}</span>
        ) : (
          <>
            <Link to="/auth">Login</Link>
            <Link to="/auth">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
