import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
      </div>
      <div className="navbar-logo">
        <Link to="/">
          <img src="/img/logo.png" alt="Logo" style={{ height: '60px'}} />
        </Link>
      </div>
      <div className="navbar-user">
        <Link to="/login" className="nav-link">Log in</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
