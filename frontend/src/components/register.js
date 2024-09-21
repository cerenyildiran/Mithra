import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../middleware/useUser";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const {user, setUser} = useUser()
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      verifyUser(accessToken);
    }
  }, []);

  const verifyUser = async (token) => {
    try {
      const response = await axios.post('http://localhost:8000/api/verifyToken/', {
        token
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.user) {
        setUser(response.data.user);
        navigate('/')
      }
    } catch (err) {
      console.error('Token verification error:', err);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
    }

    try {
        await axios.post('http://localhost:8000/api/register/', {
            username,
            email,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setSuccess(true);
        setError(null);
        navigate('/login')
    } catch (error) {
        setError(error.response?.data?.error || 'An error occurred during registration.');
        setSuccess(false);
    }
};

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Register</h2>
        {success && <p className="success-msg">Registration successful!</p>}
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
