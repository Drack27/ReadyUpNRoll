import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PlayerPoolCreation.css';
import logo from './logo.svg';

function OfferCampaignSettings() {
  const [showExplainer, setShowExplainer] = useState(true);
  const [campaignSettings, setCampaignSettings] = useState([]);

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

  // Function to add a new campaign setting
  const addCampaignSetting = (newSetting) => {
    setCampaignSettings([...campaignSettings, newSetting]);
  };

  return (
    <div className="player-pool-creation">
      <header className="creation-header">
      <div className="header-left">
          <img src={logo} alt="ReadyUp & Roll Logo" className="logo" />
          <div className="header-buttons">
          <Link to="/settings">
            <button>Settings</button>
          </Link>
            <button>Log Out</button>
            <button>Return to Home Screen</button>
          </div>
        </div>

        <div className="header-right">
          <img src="avatar.png" alt="User Avatar" className="avatar" />
        </div>
      </header>

      <div className="creation-content">
        <h1 className="creation-header">Offer Campaign Settings</h1>

        {/* Explainer (same as before) */}
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

        <div className="steps-and-form">
          {/* Creation Steps (updated) */}
          <div className="creation-steps">
            <h2>Creating a new player pool</h2>
            <ol>
              <li>
                <Link to="/PPCname">Name & Describe the Pool</Link>
              </li>
              <li>
                <Link to="/OfferGameSystems">Offer Game Systems</Link>
              </li>
              <li className="current-step">Offer Campaign Settings</li>
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

          <div className="campaign-settings-gallery">
            <button className="add-campaign-setting-button">
              <Link to="/campaign-setting-details">
                Add New Campaign Setting
              </Link>
            </button>

            <div className="gallery-grid">
              {campaignSettings.map((setting, index) => (
                <div key={index} className="campaign-setting-card">
                  <img
                    src={setting.imageUrl}
                    alt={setting.name}
                    className="thumbnail"
                  />
                  <div className="setting-info">
                    <h3>{setting.name}</h3>
                    <p>{setting.tagline}</p>
                    <Link
                      to="/campaign-setting-details"
                      state={{ setting: setting }}
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

export default OfferCampaignSettings;