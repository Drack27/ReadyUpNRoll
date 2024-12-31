// ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function ProtectedRoute() {
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log("isLoggedIn:", isLoggedIn);

  const navigate = useNavigate();


  useEffect(() => {
    const checkLoginStatus = async () => { // Make checkLoginStatus async
      const token = localStorage.getItem('token');
      if (token) {
        // *** Perform your actual JWT verification here (if needed) ***
        setIsLoggedIn(true); 
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false); // Update loading state after the check
    };
    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator
  }
  console.log("isLoggedIn:", isLoggedIn);
  return isLoggedIn ? <Outlet /> : navigate('/login'); // Redirect if not logged in
}

export default ProtectedRoute;