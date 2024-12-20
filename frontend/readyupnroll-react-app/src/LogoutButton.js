import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the JWT from local storage
    navigate('/login'); // Redirect to the login page 
  };

  return (
    <button onClick={handleLogout}>Log out</button>
  );
}

export default LogoutButton;