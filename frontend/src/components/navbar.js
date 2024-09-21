import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { useUser } from "../middleware/useUser";

const Navbar = ({ user }) => {
  const { setUser } = useUser();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove('accessToken');
    setUser(null);
    navigate('/')
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
      </div>
      <div className="navbar-logo">
        <Link to="/">
          <img src="/img/logo.png" alt="Logo" style={{ height: "60px" }} />
        </Link>
      </div>
      <div className="navbar-user">
        {user ? (
          <>
            <div className="profile-menu" >
            <Link to="/profile">
          <FaUserCircle className="profile-icon" size={25} />
        </Link>
              <span className="user-greeting">Welcome, {user.username}</span>
              <FaChevronDown className="dropdown-icon" onClick={toggleDropdown} style={{ position: 'relative' }}/>
              {dropdownVisible && (
                <div className="dropdown-menu" >
                  <button onClick={handleLogout} className="dropdown-item">Log out</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Log in</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
