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
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src="/img/logo.png" alt="Logo" style={{ height: "60px" }} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {user ? (
              <li className="nav-item dropdown">
                <div className="d-flex align-items-center">
                  <Link to="/profile" className="nav-link">
                    <FaUserCircle className="profile-icon" size={25} />
                  </Link>
                  <span className="user-greeting">Welcome, {user.username}</span>
                  <FaChevronDown
                    className="dropdown-icon ms-2"
                    onClick={toggleDropdown}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                {dropdownVisible && (
                  <ul className="dropdown-menu dropdown-menu-end" style={{ position: "absolute" }}>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item">
                        Log out
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Log in
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
