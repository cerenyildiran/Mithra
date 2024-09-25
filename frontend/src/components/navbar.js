import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaChevronDown, FaBars } from "react-icons/fa";
import { useUser } from "../middleware/useUser";

const Navbar = ({ user }) => {
  const { setUser } = useUser();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileDropdownVisible, setMobileDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("accessToken");
    setUser(null);
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const toggleMobileDropdown = () => {
    setMobileDropdownVisible(!mobileDropdownVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".dropdown-icon") &&
        !event.target.closest(".navbar-toggler") &&
        !event.target.closest(".custom-dropdown-menu")
      ) {
        setDropdownVisible(false);
        setMobileDropdownVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setDropdownVisible(false);
    setMobileDropdownVisible(false);
  }, [navigate]);
  useEffect(() => {
    console.log("Dropdown Visible:", mobileDropdownVisible);
  }, [mobileDropdownVisible]);
  

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src="/img/logo.png" alt="Logo" style={{ height: "30px" }} />
        </Link>
        <div className="navbar-toggler">
          <FaChevronDown onClick={toggleMobileDropdown} style={{ cursor: "pointer" }} />
        </div>
        {mobileDropdownVisible && (
          <div
            className="custom-dropdown-menu"
            style={{ position: "absolute", right: 0, top: "100%" }}
          >
            {user ? (
              <>
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <Link to="/profile/edit" className="dropdown-item">Edit Profile</Link>
                <button onClick={handleLogout} className="dropdown-item">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="dropdown-item">Log in</Link>
                <Link to="/register" className="dropdown-item">Register</Link>
              </>
            )}
          </div>
        )}

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <div className="nav-item d-flex align-items-center">
                <Link to="/profile" className="nav-link">
                  <FaUserCircle size={25} />
                </Link>
                <span className="user-greeting ms-2">
                  Welcome, {user.username}
                </span>
                <FaChevronDown
                  className="dropdown-icon ms-2"
                  onClick={toggleDropdown}
                  style={{ cursor: "pointer" }}
                />
                {dropdownVisible && (
                  <div
                    className="custom-dropdown-menu"
                    style={{ position: "absolute", right: 0, top: "100%" }}
                  >
                    <Link to="/profile" className="dropdown-item">
                      Profile
                    </Link>
                    <Link to="/profile/edit" className="dropdown-item">
                      Edit Profile
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item">
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="d-flex">
                <Link to="/login" className="nav-link">
                  Log in
                </Link>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
