//HomeScreen.js
import React, { useState, useEffect } from 'react';
import './HomeScreen.css';
import { Link, useNavigate } from 'react-router-dom';
import TopBar from './TopBar';

function HomeScreen() {
  const [username, setUsername] = useState('');
  const [gmWorlds, setGmWorlds] = useState([]); // Renamed for clarity
  const [playerWorlds, setPlayerWorlds] = useState([]); // Worlds the user is a *player* in
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryPlayer, setSearchQueryPlayer] = useState(''); //separate search for player section
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Fetch user data (remains the same)
          const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUsername(userData.username);
            setUserId(userData.id);

            // Fetch GM worlds (renamed for clarity)
            const gmWorldsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/worlds/gm/${userData.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (gmWorldsResponse.ok) {
              const gmWorldsData = await gmWorldsResponse.json();
              setGmWorlds(gmWorldsData);
            } else {
              console.error('Failed to fetch GM worlds:', gmWorldsResponse.status);
            }

            // Fetch Player Worlds (NEW)
            const playerWorldsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/worlds/player/${userData.id}`, {  // <---  CHANGE THIS URL to your actual endpoint
              headers: { Authorization: `Bearer ${token}` },
            });

            if (playerWorldsResponse.ok) {
              const playerWorldsData = await playerWorldsResponse.json();
              setPlayerWorlds(playerWorldsData);
            } else {
              console.error('Failed to fetch player worlds:', playerWorldsResponse.status);
              // Consider redirecting to login on 401 here as well
              if(playerWorldsResponse.status === 401){
                navigate('/login');
              }
            }

          } else {
            console.error('Failed to fetch user data:', userResponse.status);
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
  }, [navigate]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
    const handleSearchInputChangePlayer = (event) => {
    setSearchQueryPlayer(event.target.value);
  };

  const filteredGmWorlds = gmWorlds.filter((world) => {
    const nameMatch = world.name.toLowerCase().includes(searchQuery.toLowerCase());
    const taglineMatch = world.tagline ? world.tagline.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    return nameMatch || taglineMatch;
  });

  const filteredPlayerWorlds = playerWorlds.filter((world) => { //player worlds filtered
    const nameMatch = world.name.toLowerCase().includes(searchQueryPlayer.toLowerCase());
    const taglineMatch = world.tagline ? world.tagline.toLowerCase().includes(searchQueryPlayer.toLowerCase()) : false;
    return nameMatch || taglineMatch;
  });
    
  return (
    <div className="home-screen">
      <TopBar hideHomeButton={true} />

      <h1 className="welcome-header">
        Howdy, {username || 'Guest'}! This is the Home Screen.
      </h1>

      {/* GM Section */}
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
            {filteredGmWorlds.length > 0 ? (
              filteredGmWorlds.map((world) => (
                <li key={world.id}>
                  <div className="world-details">
                    <h3>{world.name}</h3>
                    <p>{world.tagline}</p>
                  </div>
                  <div className="world-buttons">
                    <Link to={`/WorldDetailsGMEdit/${world.id}`}>
                      <button>View/Edit Details</button>
                    </Link>
                    <Link to={`/InvitePlayers/${world.id}`}>
                      <button>Invite/Kick Players</button>
                    </Link>
                  </div>
                </li>
              ))
            ) : (
              <li>No worlds found!</li>
            )}
          </ul>
        </div>
        <Link to="/WorldDetailsGMCreate">
          <button>Create A World</button>
        </Link>
      </div>

      {/* Player Section */}
      <div className="player-section">
        <h2>These are the Worlds you have joined</h2>
        <input
          type="text"
          placeholder="Search worlds..."
          className="search-bar"
          value={searchQueryPlayer}
          onChange={handleSearchInputChangePlayer}
        />
        <div className={`world-list`}>
          <ul>
            {/* Map over filteredPlayerWorlds */}
            {filteredPlayerWorlds.length > 0 ? (
              filteredPlayerWorlds.map((world) => (
                <li key={world.id}>
                  <div className="world-details">
                    <h3>{world.name}</h3>
                    <p>{world.tagline}</p>
                  </div>
                  <div className="world-buttons">
                    <Link to={`/ReviewLeave/${world.id}`}>
                      <button>View Details/Leave</button>
                    </Link>
                    <Link to={`/ReadyUpScreen/${world.id}`}>
                      <button>READY UP (Set Availability)</button>
                    </Link>
                  </div>
                </li>
              ))
            ) : (
              <li>No worlds found!</li>
            )}
          </ul>
        </div>
        <Link to="/JoinWorld">
          <button>Join A World</button>
        </Link>
      </div>
    </div>
  );
}

export default HomeScreen;