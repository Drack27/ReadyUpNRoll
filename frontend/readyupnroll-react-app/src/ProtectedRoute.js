// ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function ProtectedRoute() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');

      // *** Replace this with your actual JWT verification logic ***
      // For this example, we're simply checking if a token exists
      if (token) { 
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        navigate('/login'); // Redirect to login if not logged in
      }
    };

    checkLoginStatus();
  }, []); // Empty dependency array ensures this runs only once

  return isLoggedIn ? <Outlet /> : null; 
}

export default ProtectedRoute;