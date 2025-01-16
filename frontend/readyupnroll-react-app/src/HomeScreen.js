import React, { useState, useEffect } from 'react';
import './HomeScreen.css'; 
import logo from './logo.svg'; 
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import TopBar from './TopBar';

function HomeScreen() {
  console.log("homescreen rendered");
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'gallery'
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate


  useEffect(() => {
    const fetchUsername = async () => {
      if (!username) { // Only fetch if username is not already set
        const token = localStorage.getItem('token');
        if (token) {
          console.log('Token in HomeScreen:', token);
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Response from /api/me:', response);
            if (response.ok) {
              const data = await response.json();
              console.log('Data from /api/me:', data);
              setUsername(data.username);
            } else {
              console.error('Failed to fetch username:', response.status);
              navigate('/login');
            }
          } catch (error) {
            console.error('Error fetching username:', error);
          }
        }
      }
    };
  
    fetchUsername();
  }, [username]); // Dependency array now includes 'username'
  

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="home-screen">
      <TopBar hideHomeButton={true}></TopBar>

      <h1 className="welcome-header">
      Howdy, {username || 'Guest'}! This is the Home Screen. 
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