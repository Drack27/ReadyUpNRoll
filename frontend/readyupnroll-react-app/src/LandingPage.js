import './LandingPage.css'; // Import your CSS file for styling

import { Link } from 'react-router-dom';

function LandingPage() {
    return (
      <div className="landing-page">
        <header className="landing-page-header">
          <h1>ReadyUp & Roll</h1>
          <p className="tagline">Player-driven RPG scheduling</p>
        </header>
  
        <div className="button-container">
        <Link to="/login">
          <button className="login-button">Login</button>
        </Link>
          <button className="signup-button">Sign Up</button>
        </div>   
  
  
        <div className="blurb-container">
          <h2 className="blurb-tag">How It Works</h2>
          <p>
            GMs create a pool of players they're willing to run for, and offer them campaign settings, game systems, & plot hooks, empowering players to form their own campaigns. Players in that pool then invite each other to campaigns, and each player 'readies up' for times they can play. Once a whole party has "readied up", the session is booked! No more endless scheduling chats, no more wrangling with tools built for corporate meetings. Just more FRIGGIN GAMING
          </p>
        </div>
      </div>
    );
  }
  
  export default LandingPage;