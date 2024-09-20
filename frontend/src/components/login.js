import React, { useState } from "react";
import Cookies from 'js-cookie'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    try {
        const response = await axios.post('http://localhost:8000/api/login/', {
            username: trimmedUsername,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const { refresh, access, user } = response.data;
        Cookies.set('accessToken', access, { expires: 1, secure: true, sameSite: 'Strict' });
        Cookies.set('refreshToken', refresh, { expires: 1, secure: true, sameSite: 'Strict' });
        setUser(user);
        navigate('/');
    } catch (error) {
        setError(error.response ? error.response.data.error : "An error occurred");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-msg">{error}</p>}
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;
