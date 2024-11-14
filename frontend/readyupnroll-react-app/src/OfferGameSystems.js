import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router
import './PlayerPoolNamePage.css';
import logo from './logo.svg';

function OfferGameSystems() {
  const [showExplainer, setShowExplainer] = useState(true);
  const [gameSystems, setGameSystems] = useState([]); // Store game systems data

  const handleToggleExplainer = () => {
    setShowExplainer(!showExplainer);
    localStorage.setItem('showExplainer', !showExplainer);
  };

  // Load explainer state from localStorage
  useEffect(() => {
    const storedShowExplainer = localStorage.getItem('showExplainer');
    if (storedShowExplainer !== null) {
      setShowExplainer(storedShowExplainer === 'true');
    }
  }, []);

  // Function to add a new game system (will be called from GameSystemDetails page)
  const addGameSystem = (newSystem) => {
    setGameSystems([...gameSystems, newSystem]);
  };

  return (
    <div className="player-pool-creation">
      {/* Header (same as before) */}
      <header className="creation-header">
        <div className="header-left">
          <img src={logo} alt="ReadyUp & Roll Logo" className="logo" />
          <div className="header-buttons">
            <button>Settings</button>
            <button>Log Out</button>
            <button>Return to Home Screen</button>
          </div>
        </div>

        <div className="header-right">
          <img src="avatar.png" alt="User Avatar" className="avatar" />
        </div>
      </header>

      <div className="creation-content">
        <h1 className="creation-header">Offer Game Systems</h1>

        {/* Explainer (same as before) */}
        {showExplainer && (
          <div className="explainer-box">
            <p>
              Player Pools consist of the pool of players you are willing to run
              games for, as well as the Game Systems, Campaign Settings, and
              Starting Plot Hooks that the you are willing to offer to those
              players.
            </p>
            <button onClick={handleToggleExplainer}>
              Hide Explainer
            </button>
          </div>
        )}

        <div className="steps-and-form">
          {/* Creation Steps (updated) */}
          <div className="creation-steps">
            <h2>Creating a new player pool</h2>
            <ol>
              <li>
                <Link to="/create-pool">Name & Describe the Pool</Link>
              </li>
              <li className="current-step">Offer Game Systems</li>
              <li>
                <Link to="/offer-campaign-settings">
                  Offer Campaign Settings
                </Link>
              </li>
              <li>
                <Link to="/add-starting-modules">Add Starting Modules</Link>
              </li>
              <li>
                <Link to="/invite-players">Invite Players</Link>
              </li>
              <li>
                <Link to="/confirm-and-launch">Confirm and Launch</Link>
              </li>
            </ol>
          </div>

          <div className="game-systems-gallery">
            <button className="add-game-system-button">
              <Link to="/game-system-details">Add New Game System</Link>
            </button>

            <div className="gallery-grid">
              {gameSystems.map((system, index) => (
                <div key={index} className="game-system-card">
                  <img
                    src={system.imageUrl} // Replace with actual image URL
                    alt={system.name}
                    className="thumbnail"
                  />
                  <div className="system-info">
                    <h3>{system.name}</h3>
                    <p>{system.tagline}</p>
                    <Link
                      to="/game-system-details"
                      state={{ system: system }} // Pass system data for editing
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfferGameSystems;