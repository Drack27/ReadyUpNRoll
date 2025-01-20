import React, { useState, useEffect } from 'react';
import './HomeScreen.css'; 
import logo from './logo.svg'; 
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import TopBar from './TopBar';

function HomeScreen() {
  console.log("homescreen rendered");
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'gallery'
  const [username, setUsername] = useState('');
  const [worlds, setWorlds] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Token in HomeScreen:', token);
        try {
          // Fetch user data (including ID)
          const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Response from /api/me:', userResponse);

          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log('Data from /api/me:', userData);
            setUsername(userData.username);
            setUserId(userData.id); // Set the user ID

            // Fetch worlds using the user ID
            const worldsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/worlds/gm/${userData.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Response from /api/worlds/gm:', worldsResponse);

            if (worldsResponse.ok) {
              const worldsData = await worldsResponse.json();
              console.log('Data from /api/worlds/gm:', worldsData);
              setWorlds(worldsData);
            } else {
              console.error('Failed to fetch worlds:', worldsResponse.status);
            }
          } else {
            console.error('Failed to fetch user data:', userResponse.status);
            navigate('/login');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, []); // Run only once when the component mounts
  

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
          <h2>These are the Worlds you own</h2>
          <input type="text" placeholder="Search worlds..." className="search-bar" />
          <div className={`world-list ${viewMode}`}>
            <ul>
              {worlds.map((world) => (
                <li key={world.id}>
                  <div className="world-details">
                    <h3>{world.name}</h3>
                    <p>{world.tagline}</p>
                  </div>
                  <div className="world-buttons">
                    <button>View/Edit Details</button>
                    <button>Duplicate</button>
                    <button>Invite a Player</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Link to="/WorldDetailsGM">
            <button>Create A World</button>
          </Link>
        </div>

        <div className="player-section">
          <h2>These are the Worlds you have joined</h2>
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