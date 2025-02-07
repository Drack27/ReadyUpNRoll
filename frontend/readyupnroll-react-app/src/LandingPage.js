// LandingPage.js
import './LandingPage.css';

import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-page-header">
        <h1>ReadyUp & Roll</h1>
        <p className="tagline">Real Scheduling for Fantastical Places</p>
      </header>

      <div className="button-container">
        <Link to="/login">
          <button className="login-button">Login</button>
        </Link>
        <Link to="/signup">
          <button className="signup-button">Sign Up For Free</button>
        </Link>
      </div>  

      <section id="tutorial"> 
        <h2>Tutorial!</h2>  {/* Removed asterisks */}
        <div id="video-placeholder"> 
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/YOUR_YOUTUBE_VIDEO_ID_HERE" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen>
          </iframe>
        </div> 
        <h3>Easily find time, friends, & settings for:</h3> {/* Added header */}
        <ul> {/* Added bullet points */}
          <li>Tabletop RPGs, like Dungeons & Dragons, Call of Cthulhu, & Shadowrun</li>
          <li>Self-hosted video games, like Minecraft, The Forest, Rust, & Palworld</li>
          <li>Improv events & Interactive/immersive theatre</li>
          <li>And so much more!</li>
        </ul>
        <p> {/* Added line break/space */}
          Ready Up & Roll takes the hassle out of getting to fantastical places with extraordinary people. Effortlessly schedule sessions, discover a variety of game systems and settings, and get matched with people you enjoy spending time with.
        </p>
      </section>
    </div>
  );
}

export default LandingPage;