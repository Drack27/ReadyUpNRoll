import React from 'react';
import './Pricing.css'; // Import the CSS file
import TopBar from './TopBar';

function Pricing() {
  return (
    <div className="pricing-container">
      <TopBar></TopBar>
      <h1 className="pricing-header">Pricing Plans (Coming Soon!)</h1>

      <p className="pricing-intro">
        We're currently offering a free beta version of our platform. We plan to
        introduce premium features and specialized packages in the future.
        Here's a sneak peek of what's to come!
      </p>

      <div className="pricing-section">
        <h2>FREE FEATURES (Current Release)</h2>
        <ul className="features-list">
          <li>World creation (2)</li>
          <li>Scheduling</li>
          <li>Booking</li>
          <li>Join worlds (3)</li>
          <li>Basic email notifications (booked, cancelled, 1 reminder day before)</li>
          <li>Manual fixed session length</li>
          <li>Number of players setting</li>
          <li>Require all players for session zero setting</li>
          <li>Buffer time setting</li>
          <li>Minimum Notice & Date Range</li>
          <li>Recurring availability for players (every Tuesday, etc.)</li>
        </ul>
      </div>

      <div className="pricing-section">
        <h2>Future Releases (including 1.0)</h2>
        <ul className="features-list">
          <li>Forums & discussion boards</li>
          <li>World chat</li>
        </ul>
      </div>

      <div className="pricing-section">
        <h2>PREMIUM FEATURES (Coming in 1.0)</h2>
        <p>
          Price: <b>~$10/month</b> (subject to change based on feedback)
        </p>
        <ul className="features-list">
          <li>World cap raised to 15</li>
          <li>Unlimited world joins</li>
          <li>
            Advanced notifications & automation settings (reminders, follow-ups,
            etc.)
          </li>
          <li>Other notification avenues besides email (text, etc.)</li>
          <li>"Paint" mode, with max & min session length in your GM'd worlds</li>
          <li>Min/max session length, set individually by world</li>
        </ul>
      </div>

      <div className="pricing-section">
        <h2>Future Premium Releases</h2>
        <ul className="features-list">
          <li>Multi-party/group worlds</li>
          <li>Mobile app</li>
          <li>Dynamic world maps</li>
          <li>Multi-GM worlds</li>
          <li>Matchmaking</li>
          <li>D&D Beyond integration?</li>
          <li>Discord integration?</li>
          <li>Demiplane integration?</li>
          <li>Calendar integrations?</li>
        </ul>
      </div>

      <div className="pricing-section">
        <h2>SPECIALIZED PACKAGES (Future Releases)</h2>
        <p>
          Price: <b>~$5/month extra</b> (subject to change based on feedback)
        </p>
        <ul className="features-list">
          <li>
            <b>LARP package!</b>
            <ul>
              <li>Prop tracking</li>
              <li>Venue/location management</li>
              <li>& more!</li>
            </ul>
          </li>
          <li>
            <b>Creative writing package!</b>
            <ul>
              <li>Progress tracking</li>
              <li>Shared document editing</li>
              <li>Google Docs integration</li>
            </ul>
          </li>
          <li>
            <b>Escape room owner package!</b>
            <ul>
              <li>Manage customer info</li>
              <li>Track game statistics</li>
            </ul>
          </li>
          <li>& more to come!</li>
        </ul>
      </div>

      <div className="feedback-section">
        <h2>We Want Your Feedback!</h2>
        <p>
          What do you think of our planned premium features and pricing? What
          other features would you like to see? Let us know!
        </p>
        {/* Add a feedback form or a link to a survey here */}
        {/* Example using a simple link: */}
        <a href="https://forms.gle/your-google-form-id" target="_blank" rel="noopener noreferrer">
          <button className="feedback-button">Give Feedback</button>
        </a>
      </div>
    </div>
  );
}

export default Pricing;