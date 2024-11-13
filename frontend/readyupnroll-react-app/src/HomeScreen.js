import React, { useState } from 'react';
import './HomeScreen.css'; // Import your CSS file
import logo from './logo.svg'; // Import your logo image

function HomeScreen() {
  const [viewMode, setViewMode] = useState('both'); // 'gm', 'player', or 'both'

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="home-screen">
      <header className="home-screen-header">
        <img src={logo} alt="ReadyUp & Roll Logo" className="logo" />

        <div className="header-buttons">
          <button>Settings</button>
          <button>Log Out</button>
        </div>
      </header>

      <h1 className="welcome-header">
        Howdy, {/* Replace with actual username or 'Developer' */}! This is the
        Home Screen.
      </h1>

      <div className="view-mode-toggle">
        <button onClick={() => handleViewModeChange('gm')}>GM</button>
        <button onClick={() => handleViewModeChange('player')}>Player</button>
        <button onClick={() => handleViewModeChange('both')}>Both</button>
      </div>

      <div className="home-content">
        {viewMode === 'gm' || viewMode === 'both' ? (
          <div className="gm-section">
            <h2>Game Master (GM)</h2>
            <div className="gm-lists">
              <div className="list-container">
                <h3>Your Player Pools</h3>
                {/* Add search bar and "Create a New Pool" button here */}
                <ul>
                  {/* Placeholder for player pool list items */}
                  <li>Pool Name - Tagline/Description</li>
                </ul>
              </div>
              <div className="list-container">
                <h3>Your Players' Campaigns</h3>
                {/* Add search bar here */}
                <ul>
                  {/* Placeholder for campaign list items */}
                  <li>Campaign Title - Pool Name</li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {viewMode === 'player' || viewMode === 'both' ? (
          <div className="player-section">
            <h2>Player</h2>
            <div className="player-lists">
              <div className="list-container">
                <h3>Create a Campaign</h3>
                {/* Add search bar and "Join a Player Pool" button here */}
                <ul>
                  {/* Placeholder for player pool list items */}
                  <li>Pool Name - Tagline/Description</li>
                </ul>
              </div>
              <div className="list-container">
                <h3>Ready Up for Sessions</h3>
                {/* Add search bar here */}
                <ul>
                  {/* Placeholder for campaign list items */}
                  <li>Campaign Title - Pool Name</li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default HomeScreen;