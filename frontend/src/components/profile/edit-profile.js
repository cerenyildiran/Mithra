import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const EditProfile = ({ user }) => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    email: "",
    first_name: "",
    last_name: "",
    username: "",
  });
  const [activeTab, setActiveTab] = useState("Profile");
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      verifyUser(accessToken);
    } else {
      navigate("/");
    }
    setUserDetails({
      email: user?.email || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      username: user?.username || "",
    });
  }, [user, navigate]);

  const verifyUser = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/verifyToken/",
        { token },
        { headers: { "Content-Type": "application/json" } }
      );
      if (!response.data.user) {
        navigate("/");
      }
    } catch (err) {
      console.error("Token verification error:", err);
      navigate("/");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = Cookies.get("accessToken");
    try {
      await axios.post(
        "http://localhost:8000/api/edit-profile/",
        {
          email: userDetails.email,
          first_name: userDetails.first_name,
          last_name: userDetails.last_name,
          token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword =
      document.getElementById("confirmNewPassword").value;
    const token = Cookies.get("accessToken");
    if (newPassword !== confirmNewPassword) {
      alert("The new passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      alert("The new passwords can not be short than 8 caracter.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8000/api/change-password/",
        {
          current_password: currentPassword,
          new_password: newPassword,
          token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Failed to update password:", error);
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.id]: e.target.value });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <div className="d-flex flex-column gap-2">
            <button
              className="btn btn-primary mb-2"
              onClick={() => handleTabClick("Profile")}
            >
              Profile
            </button>

            <button
              className="btn btn-primary mb-2"
              onClick={() => handleTabClick("Change User")}
            >
              Change User
            </button>

            <button
              className="btn btn-primary mb-2"
              onClick={() => handleTabClick("Change Password")}
            >
              Change Password
            </button>
          </div>
        </div>
        <div className="col-md-9">
          {activeTab === "Profile" && (
            <div>
              <h1>Edit Profile</h1>
              {user && (
                <div className="card">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Email:</strong>{" "}
                      {user.email ? user.email : "No email provided"}
                    </li>
                    <li className="list-group-item">
                      <strong>First Name:</strong>{" "}
                      {user.first_name
                        ? user.first_name
                        : "No first name provided"}
                    </li>
                    <li className="list-group-item">
                      <strong>Last Name:</strong>{" "}
                      {user.last_name
                        ? user.last_name
                        : "No last name provided"}
                    </li>
                    <li className="list-group-item">
                      <strong>Username:</strong>{" "}
                      {user.username ? user.username : "No username provided"}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {activeTab === "Change User" && (
            <div>
              <h1>Edit Profile</h1>
              {user && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      defaultValue={userDetails.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="first_name" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      defaultValue={userDetails.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      defaultValue={userDetails.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      defaultValue={user.username}
                      readOnly
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update Profile
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === "Change Password" && (
            <div>
              <h1>Change Password</h1>
              {user && (
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmNewPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmNewPassword"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Change Password
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default EditProfile;
