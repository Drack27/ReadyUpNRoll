import React, { useState } from 'react';
import './SettingsScreen.css'; // Import your CSS file
import logo from './logo.svg'; // Import your logo image

function SettingsScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div   
 className="settings-screen">
      <header className="settings-screen-header">
        <div className="header-left">
          <img src={logo} alt="ReadyUp & Roll Logo" className="logo" />
          <div className="header-buttons">
            <button>Exit</button>
            <button>Log Out</button>
          </div>
        </div>

        <div className="header-right">
          <img src="avatar.png" alt="User Avatar" className="avatar" />
        </div>
      </header>

      <div className="settings-content">
        <div className="header-and-button"> {/* Container for header and button */}
          <h1 className="settings-header">Account Details & Settings</h1>
          <button className="edit-profile-button">Edit Profile</button>
        </div>

        <section className="general-section">
          <h2>General Stuff</h2>
          <div className="visibility-key">
            <h3>VISIBILITY KEY</h3>
            <p>
              <b>Public:</b> anyone on the site can find and view it<br />
              <b>Private:</b> only members of the same player pools as you can
              find and view it<br />
              <b>THEY'RE OUT TO GET ME:</b> Only GMs of player pools in which you
              are a member can view it<br />
              <b>Invisible:</b> No one can view it. (Your password is the only
              thing that is invisible)
            </p>
          </div>
          <div className="general-info">
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">[username]</span>
              <span className="info-visibility">Public (cannot be changed)</span>
            </div>
            <div className="info-item">
              <span className="info-label">Real Name:</span>
              <span className="info-value">[realname]</span>
              <span className="info-visibility">
                {/* Replace with actual visibility */}
                [Private/Public/THEY'RE OUT TO GET ME]
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">[email]</span>
              <span className="info-visibility">
                {/* Replace with actual visibility */}
                [Private/Public/THEY'RE OUT TO GET ME]
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Password:</span>
              <span className="info-value">
                {showPassword ? '[password]' : '********'}
              </span>
              <span className="info-visibility">
                {/* Replace with actual visibility */}
                [Private/Public/THEY'RE OUT TO GET ME]
              </span>
              <button
                className="show-password-button"
                onMouseDown={handlePasswordVisibility}
                onMouseUp={handlePasswordVisibility}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="info-item">
              <span className="info-label">
                Visibility of everything else:
              </span>
              <span className="info-value">
                {/* Replace with actual visibility */}
                [private/public/THEY'RE OUT TO GET ME]
              </span>
            </div>
          </div>
        </section>

        <section className="gm-section">
          <h2>GM Stuff</h2>
          <div className="gm-settings">
            <div className="setting-item">
              <span className="setting-label">
                Currently open to run games:
              </span>
              <span className="setting-value">[Yes/No]</span>
            </div>
            <div className="setting-item">
              <span className="setting-label">
                Minimum-Maximum Session Length:
              </span>
              <span className="setting-value">[Min-Max Hours]</span>
              <p className="setting-explainer">
                (sessions shorter than your minimum session length or longer
                than your maximum session length will not be booked)
              </p>
            </div>
            <div className="setting-item">
              <span className="setting-label">Max Sessions</span>
              <p className="setting-explainer">
                (once your maximum number of sessions have been booked for each
                of these given time periods, players will no longer be able to
                ready up for sessions in any of your pools for that given time
                period)
              </p>
              <div className="max-sessions">
                <span className="max-session-label">Per Day:</span>
                <span className="max-session-value">[DayMax]</span>
              </div>
              <div className="max-sessions">
                <span className="max-session-label">Per Week:</span>
                <span className="max-session-value">[WeekMax]</span>
              </div>
              <div className="max-sessions">
                <span className="max-session-label">Per Month:</span>
                <span className="max-session-value">[MonthMax]</span>
              </div>
              <div className="max-sessions">
                <span className="max-session-label">Per Year:</span>
                <span className="max-session-value">[YearMax]</span>
              </div>
            </div>
            <div className="setting-item">
              <span className="setting-label">Buffer Time:</span>
              <span className="setting-value">[BufferTime]</span>
              <p className="setting-explainer">
                (This is the minimum ammount of time there must be between
                sessions)
              </p>
            </div>
            <div className="setting-item">
              <span className="setting-label">Minimum Notice:</span>
              <span className="setting-value">[MinNotice]</span>
              <p className="setting-explainer">
                (Players may not ready up for sessions and sessions will not be
                booked unless they are at least this far in the future)
              </p>
            </div>
            <div className="setting-item">
              <span className="setting-label">Maximum Future Booking:</span>
              <span className="setting-value">[MaxNotice]</span>
              <p className="setting-explainer">
                (No times further in the future than this will be available for
                players to ready up, and sessions will not be booked if they are
                further than this far into the future)
              </p>
            </div>
          </div>
          <button className="availability-button">
            View & Edit Availability
          </button>
        </section>

        <section className="player-section">
          <h2>Player Stuff</h2>
          <p>Coming soon!</p>
        </section>
      </div>
    </div>
  );
}

export default SettingsScreen;