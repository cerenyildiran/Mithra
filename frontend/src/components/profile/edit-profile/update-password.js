import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const UpdatePassword = ({ user }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const handlePasswordUpdate = async (event) => {
    event.preventDefault();
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword =
      document.getElementById("confirmNewPassword").value;
    const token = Cookies.get("accessToken");
    if (newPassword !== confirmNewPassword) {
      setError('The new passwords do not match.')
      return;
    }
    if (newPassword.length < 8) {
      setError("The new passwords can not be short than 8 caracter.")
      return;
    }
    try {
      const response = await axios.post(
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
      if(response.data.success){
        setSuccess(response.data.success)
        document.getElementById("currentPassword").value = ''
        document.getElementById("newPassword").value = ''
        document.getElementById("confirmNewPassword").value = ''
      }
    } catch (error) {
      setError(error.response.data.error)
    }
  };

  return (
    <div>
      {success && <p className="success-msg">Password succesfull changed</p>}
      {error && <p className="error-msg">{error}</p>}
      {user && (
        <form onSubmit={handlePasswordUpdate}>
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
  );
};

export default UpdatePassword;
