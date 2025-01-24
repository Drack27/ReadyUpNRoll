import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './InvitePlayers.css';
import TopBar from './TopBar';

function InvitePlayers() {
  const { worldId } = useParams();
  const [worldName, setWorldName] = useState('');
  const [invitedPlayers, setInvitedPlayers] = useState([]);
  const [joinedPlayers, setJoinedPlayers] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]); // For the searchable list
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchWorldData = async () => {
      try {
        // Fetch world data (replace with your actual API call)
        const worldResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/worlds/${worldId}`); 
        if (!worldResponse.ok) {
          throw new Error('Failed to fetch world data');
        }
        const worldData = await worldResponse.json();
        setWorldName(worldData.name);

        // Fetch invited players (replace with your actual API call)
        const invitedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/worlds/${worldId}/invited`);
        if (!invitedResponse.ok) {
          throw new Error('Failed to fetch invited players');
        }
        const invitedData = await invitedResponse.json();
        setInvitedPlayers(invitedData);

        // Fetch joined players (replace with your actual API call)
        const joinedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/worlds/${worldId}/joined`);
        if (!joinedResponse.ok) {
          throw new Error('Failed to fetch joined players');
        }
        const joinedData = await joinedResponse.json();
        setJoinedPlayers(joinedData);

      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error (e.g., display an error message)
      }
    };

    const fetchAllPlayers = async () => {
      try {
        // Fetch all players (replace with your actual API call)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`); 
        if (!response.ok) {
          throw new Error('Failed to fetch all players');
        }
        const data = await response.json();
        setAllPlayers(data);
      } catch (error) {
        console.error('Error fetching all players:', error);
        // Handle error
      }
    };

    fetchWorldData();
    fetchAllPlayers(); 
  }, [worldId]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPlayers = allPlayers.filter((player) => {
    return player.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="invite-players-page">
      <TopBar /> {/* Your TopBar component */}

      <div className="invite-players-content">
        <h1>Manage Players in {worldName}</h1>

        <div className="invite-info">
          <p>If your world is private, inviting a player sends that player a notification and allows them to join your world.</p>
          <p>If your world is public, inviting a player only sends them the invite.</p>
        </div>

        <div className="player-lists">
          {/* Searchable Player List */}
          <div className="player-list">
            <input
              type="text"
              placeholder="Search players"
              className="search-bar"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <ul>
              {filteredPlayers.map((player) => (
                <li key={player.id}>
                  {player.username} 
                  <button onClick={() => {/* Handle invite logic */}}>Invite</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Invited Players List */}
          <div className="player-list">
            <h2>Players You've Invited to {worldName} that haven't yet joined</h2>
            <ul>
              {invitedPlayers.map((player) => (
                <li key={player.id}>
                  {player.username} 
                  <button onClick={() => {/* Handle cancel invite logic */}}>Cancel Invite</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Joined Players List */}
          <div className="player-list">
            <h2>Players that have joined {worldName}</h2>
            <ul>
              {joinedPlayers.map((player) => (
                <li key={player.id}>
                  {player.username} 
                  <button onClick={() => {/* Handle remove player logic */}}>Remove Player</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvitePlayers;