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
        <Link to="/signup">
          <button className="signup-button">Sign Up</button>
          </Link>
          <Link to="/home">
          <button className="dev-bypass">DEV BYPASS</button>
          </Link>
        </div>   
  
  
        <div className="blurb-container">
          <h2 className="blurb-tag">How It Works</h2>
          <p>
            GMs create worlds, and put in their availaiblity. Players join worlds, and put in their availability. Whenever the GM and enough players are available, a session is automatically booked! No more endless scheduling chats. Just more FRIGGIN GAMING.
          </p>
        </div>
      </div>
    );
  }
  
  export default LandingPage;