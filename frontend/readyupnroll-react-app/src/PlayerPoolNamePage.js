import React, { useState, useEffect } from 'react';
import './PlayerPoolCreation.css'; // Import your CSS file
import logo from './logo.svg'; // Import your logo image
import { Link } from 'react-router-dom'; 

function PlayerPoolNamePage() {
  const [showExplainer, setShowExplainer] = useState(true);

  const handleToggleExplainer = () => {
    setShowExplainer(!showExplainer);
    // Store the showExplainer state in localStorage to persist across pages
    localStorage.setItem('showExplainer', !showExplainer);
  };

  // Load the showExplainer state from localStorage when the component mounts
  useEffect(() => {
    const storedShowExplainer = localStorage.getItem('showExplainer');
    if (storedShowExplainer !== null) {
      setShowExplainer(storedShowExplainer === 'true');
    }
  }, []);

  return (
    <div className="player-pool-creation">
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
        <h1 className="creation-header">Name & Describe Your Pool</h1>

        {showExplainer && (
          <div className="explainer-box">
            <p>
              Player Pools consist of the pool of players you are willing to run 
              games for, as well as the Game Systems, Campaign Settings, and 
              Modules that you are willing to offer to those
              players.
            </p>
            <button onClick={handleToggleExplainer}>
              Hide Explainer
            </button>
          </div>
        )}

        {/* Show Explainer button */}
        {!showExplainer && ( // Conditionally render the button
          <button className="show-explainer-button" onClick={handleToggleExplainer}>
            Show Explainer
          </button>
        )}

        <div className="steps-and-form">
          <div className="creation-steps">
            <h2>Creating a new player pool</h2>
            <ol>
              <li className="current-step">Name & Describe the Pool</li>
              <Link to="/OfferGameSystems">
              <li>Offer Game Systems</li>
              </Link>
              <li>
                <Link to="/OfferCampaignSettings">
                  Offer Campaign Settings
                </Link>
              </li>
              <li>
                <Link to="/OfferModules">Offer Modules</Link>
              </li>
              <li>
                <Link to="/InvitePlayers">Invite Players</Link>
              </li>
              <li>
                <Link to="/ConfirmAndLaunch">Confirm & Launch</Link>
              </li>
            </ol>
          </div>

          <div className="creation-form">
            <div className="form-field">
              <label htmlFor="poolName">Name your Player Pool Here</label>
              <input
                type="text"
                id="poolName"
                placeholder="The Super Homies"
              />
            </div>
            <div className="form-field">
              <label htmlFor="tagline">Give your Pool a tagline</label>
              <input
                type="text"
                id="tagline"
                placeholder="Homies that are super"
              />
            </div>
            <div className="form-field">
              <label htmlFor="disclaimers">
                Add any general disclaimers, expectations, ground rules, lines &
                veils, etc. that you have for everyone, regardless of what
                campaign options they choose
              </label>
              <textarea id="disclaimers"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerPoolNamePage;