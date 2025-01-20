import React, { useState, useEffect } from 'react'; // Import useEffect
import './TopBar.css'; 
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import LogoutButton from './LogoutButton';

function TopBar({ hideHomeButton, hideSettingsButton }) {
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Get the current location
  const [profileImage, setProfileImage] = useState(null); // State for the profile image

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
            // Construct the image path
            const imagePath = `${process.env.REACT_APP_API_URL}/uploads/${data.profileImage}`;
            setProfileImage(imagePath); 

          } else {
            console.error('Failed to fetch user data:', response.status);
            navigate('/login'); 
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [navigate]); // Add navigate as a dependency 

   // Check if the current path is the pricing page
   const isPricingPage = location.pathname === '/pricing';

  return (
    <div className="top-bar">
      <div className="left-side">
        <img src="/logo.png" alt="Ready Up & Roll Logo" className="logo" /> 
        {/* Replace /logo.png with the actual path to your logo */}
        {!hideSettingsButton &&(
          <Link to='/settings'>
          <button className="top-bar-button">Settings</button>
          </Link>
        )}
        <LogoutButton></LogoutButton>
        {!hideHomeButton && (
          <Link to='/home'>
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
      {profileImage ? ( // Conditionally render the image
          <img src={profileImage} alt="User Avatar" className="user-avatar" />
        ) : (
          <div className="user-avatar placeholder">{/* Placeholder if no image */}</div> 
        )}      
        </div>
    </div>
  );
}

export default TopBar;