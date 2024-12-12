import React, { useState } from 'react';
import './HomeScreen.css'; 
import logo from './logo.svg'; 
import { Link } from 'react-router-dom';

function HomeScreen() {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'gallery'

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="home-screen">
      <header className="home-screen-header">
        <div className="header-left"> 
          <img src={logo} alt="ReadyUp & Roll Logo" className="logo" />
          <div className="header-buttons">
            <Link to="/settings">
              <button>Settings</button>
            </Link>
            <button>Log Out</button>
          </div>
        </div>

        <div className="header-right"> 
          <img src="avatar.png" alt="User Avatar" className="avatar" /> 
        </div>
      </header>

      <h1 className="welcome-header">
        Howdy, {/* Replace with actual username or 'Developer' */}! This is the Home Screen.
      </h1>

      <div className="view-mode-toggle">
        <button onClick={() => handleViewModeChange('list')}>List View</button>
        <button onClick={() => handleViewModeChange('gallery')}>Gallery View</button>
      </div>

      <div className="home-content">
        <div className="gm-section">
          <h2>These are the Worlds in which you are a GM</h2>
          <input type="text" placeholder="Search worlds..." className="search-bar" />
          <div className={`world-list ${viewMode}`}> 
            <ul>
              {/* Placeholder for world list items */}
              <li>
                <div className="world-details"> {/* Container for world details */}
                  <h3>World Name</h3>
                  <p>Tagline/Description</p>
                </div>
                <div className="world-buttons"> {/* Container for world buttons */}
                  <button>View/Edit Details</button>
                  <button>Duplicate</button>
                  <button>Invite a Player</button>
                </div>
              </li>
              {/* More world list items */}
            </ul>
          </div>
          <Link to="/WorldDetailsGM">
          <button>Create A World</button>
          </Link>
        </div>

        <div className="player-section">
          <h2>These are the Worlds in which you are a Player</h2>
          <input type="text" placeholder="Search worlds..." className="search-bar" />
          <div className={`world-list ${viewMode}`}>
            <ul>
              {/* Placeholder for world list items */}
              <li>
                <div className="world-details">
                  <h3>World Name</h3>
                  <p>Tagline/Description</p>
                </div>
                <div className="world-buttons">
                  <button>View Details/Leave</button>
                  <button>Set Availability</button>
                </div>
              </li>
              {/* More world list items */}
            </ul>
          </div>
          <Link to="/JoinWorld">
          <button>Join A World</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;