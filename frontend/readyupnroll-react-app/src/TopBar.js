import React, { useState, useEffect } from 'react';
import './TopBar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function TopBar({ hideHomeButton, hideSettingsButton }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(null); // Add state for error handling

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            // Construct the image path only if data.profileImage is not null
            const imagePath = data.profileImage
              ? `${process.env.REACT_APP_API_URL}/uploads/${data.profileImage}`
              : null;
            setProfileImage(imagePath);
            setError(null); // Clear any previous errors
          } else {
            console.error('Failed to fetch user data:', response.status);
            setError(`Failed to fetch user data: ${response.status}`); // Set error message
            if (response.status === 404) {
              navigate('/login');
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Error fetching user data'); // Set a generic error message
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const isPricingPage = location.pathname === '/pricing';

  return (
    <div className="top-bar">
      <div className="left-side">
        <img src="/logo.png" alt="Ready Up & Roll Logo" className="logo" />
        {!hideSettingsButton && (
          <Link to="/settings">
            <button className="top-bar-button">Settings</button>
          </Link>
        )}
        <LogoutButton />
        {!hideHomeButton && (
          <Link to="/home">
            <button className="top-bar-button">Return to Home Screen</button>
          </Link>
        )}
      </div>
      <div className="center">
        {!isPricingPage && (
          <Link to="/pricing">
            <button className="get-premium-button">GET PREMIUM!</button>
          </Link>
        )}
      </div>
      <div className="right-side">
        {error && <div className="error-message">{error}</div>} {/* Display error message */}
        {profileImage ? (
          <img src={profileImage} alt="User Avatar" className="user-avatar" />
        ) : (
          <div className="user-avatar placeholder"></div>
        )}
      </div>
    </div>
  );
}

export default TopBar;