import React from 'react';
import './TopBar.css'; // Import your CSS file for styling

function TopBar() {
  // Placeholder for user avatar URL - replace with actual logic to fetch user avatar
  const userAvatarUrl = 'https://example.com/user-avatar.png'; 

  return (
    <div className="top-bar">
      <div className="left-side">
        <img src="/logo.png" alt="Ready Up & Roll Logo" className="logo" /> 
        {/* Replace /logo.png with the actual path to your logo */}
        <button className="top-bar-button">Settings</button>
        <button className="top-bar-button">Log Out</button>
        <button className="top-bar-button">Return to Home Screen</button>
      </div>
      <div className="right-side">
        <img src={userAvatarUrl} alt="User Avatar" className="user-avatar" />
      </div>
    </div>
  );
}

export default TopBar;