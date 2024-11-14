import React, { useState } from 'react';
import './HomeScreen.css'; // Import your CSS file
import logo from './logo.svg'; // Import your logo image
import { Link } from 'react-router-dom';

function HomeScreen() {
  const [viewMode, setViewMode] = useState('both'); // 'gm', 'player', or 'both'

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="home-screen">
      <header className="home-screen-header">
        <div className="header-left"> {/* Container for logo and buttons */}
          <img src={logo} alt="ReadyUp & Roll Logo" className="logo" />
          <div className="header-buttons">
          <Link to="/settings">
            <button>Settings</button>
          </Link>
            <button>Log Out</button>
          </div>
        </div>

        <div className="header-right"> {/* Container for avatar */}
          <img src="avatar.png" alt="User Avatar" className="avatar" /> {/* Replace with actual avatar image */}
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
                <div className="search-and-button"> {/* Container for search and button */}
                  <input type="text" placeholder="Search pools..." className="search-bar" />
                  <Link to="/PPCname">
                  <button>Create a New Pool</button>
                  </Link>
                </div>                <ul>
                  {/* Placeholder for player pool list items */}
                  <li>Pool Name - Tagline/Description</li>
                </ul>
              </div>
              <div className="list-container">
                <h3>Your Players' Campaigns</h3>
                <input type="text" placeholder="Search campaigns..." className="search-bar" />
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
                <div className="search-and-button">
                  <input type="text" placeholder="Search pools..." className="search-bar" />
                  <button>Join a Player Pool</button>
                </div>                <ul>
                  {/* Placeholder for player pool list items */}
                  <li>Pool Name - Tagline/Description</li>
                </ul>
              </div>
              <div className="list-container">
                <h3>Ready Up for Sessions</h3>
                <input type="text" placeholder="Search campaigns..." className="search-bar" />
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