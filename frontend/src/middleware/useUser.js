import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      verifyUser(accessToken);
    }
  }, []);

  const verifyUser = async (token) => {
    try {
      const response = await axios.post('http://localhost:8000/api/verifyToken/', { token }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
