import React, { useState, useEffect } from 'react';
import './HomeScreen.css';
import { Link, useNavigate } from 'react-router-dom';
import TopBar from './TopBar';

function HomeScreen() {
  const [username, setUsername] = useState('');
  const [worlds, setWorlds] = useState([]);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Fetch user data
          const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUsername(userData.username);
            setUserId(userData.id);

            // Fetch worlds using the user ID
            const worldsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/worlds/gm/${userData.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (worldsResponse.ok) {
              const worldsData = await worldsResponse.json();
              setWorlds(worldsData);
            } else {
              console.error('Failed to fetch worlds:', worldsResponse.status);
            }
          } else {
            console.error('Failed to fetch user data:', userResponse.status);
            // If the error is 401 Unauthorized, redirect to login
            if (userResponse.status === 401) {
              navigate('/login');
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [navigate]); // Add navigate to the dependency array

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredWorlds = worlds.filter((world) => {
    const nameMatch = world.name.toLowerCase().includes(searchQuery.toLowerCase());
    const taglineMatch = world.tagline ? world.tagline.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    return nameMatch || taglineMatch;
  });

  return (
    <div className="home-screen">
      <TopBar hideHomeButton={true} />

      <h1 className="welcome-header">
        Howdy, {username || 'Guest'}! This is the Home Screen.
      </h1>

      <div className="view-mode-toggle">
       {/* <button onClick={() => handleViewModeChange('list')}>List View</button> */}
       {/* <button onClick={() => handleViewModeChange('gallery')}>Gallery View</button> */}
      </div>

      <div className="home-content">
        <div className="gm-section">
          <h2>These are the Worlds you own</h2>
          <input
            type="text"
            placeholder="Search worlds..."
            className="search-bar"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
           <div className={`world-list`}>
            <ul>
              {/* Map over filteredWorlds instead of worlds */}
              {filteredWorlds.length > 0 ? (
              filteredWorlds.map((world) => (
                <li key={world.id}>
                  <div className="world-details">
                    <h3>{world.name}</h3>
                    <p>{world.tagline}</p>
                  </div>
                  <div className="world-buttons">
                    {/* View/Edit Details Button */}
                    <Link to={`/WorldDetailsGMEdit/${world.id}`}>
                      <button>View/Edit Details</button>
                    </Link>
                    {/* <button>Duplicate</button> */} 
                    <Link to={`/InvitePlayers/${world.id}`}>
                      <button>Invite/Kick Players</button>
                    </Link>
                  </div>
                </li>
              ))
            ) :(
              <li>No worlds found!</li>
            )}
            </ul>
          </div>
          <Link to="/WorldDetailsGMCreate">
            <button>Create A World</button>
          </Link>
        </div>

        <div className="player-section">
          <h2>These are the Worlds you have joined</h2>
          <input type="text" placeholder="Search worlds..." className="search-bar" />
          <div className={`world-list`}>
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