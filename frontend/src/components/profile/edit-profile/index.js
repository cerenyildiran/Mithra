import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import UpdateProfile from "./update-user";
import UpdatePassword from "./update-password";

const EditProfile = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      verifyUser(accessToken);
    } else {
      navigate("/");
    }
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
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
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
              onClick={() => handleTabClick("Update User")}
            >
              Update User
            </button>

            <button
              className="btn btn-primary mb-2"
              onClick={() => handleTabClick("Update Password")}
            >
              Update Password
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
          {activeTab === "Update User" && (
            <div>
              <h1>Update User</h1>
              <UpdateProfile user={user} />
            </div>
          )}

          {activeTab === "Update Password" && (
            <div>
              <h1>Update Password</h1>
              <UpdatePassword user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default EditProfile;
