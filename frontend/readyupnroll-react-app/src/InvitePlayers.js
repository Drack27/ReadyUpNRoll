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
  const [searchResults, setSearchResults] = useState();

  useEffect(() => {
    const fetchWorldData = async () => {
      try {
        const worldResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/worldsgm/${worldId}`); 
        if (!worldResponse.ok) {
          throw new Error('Failed to fetch world data');
        }
        const worldData = await worldResponse.json();
        setWorldName(worldData.name);

        const invitedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/worldsgm/${worldId}/invited`);
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

    

    fetchWorldData();
  }, [worldId]);

  const handleSearchInputChange = async (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyDown = async (event) => {
    if (event.key === 'Enter') { // Check if Enter key is pressed
      const query = event.target.value;
  
      if (query.length >= 3) { // Only search if query is at least 3 characters
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/search?q=${query}`);
          if (!response.ok) {
            throw new Error('Failed to search users');
          }
          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error('Error searching users:', error);
          // Handle error (e.g., display an error message)
        }
      } else {
        setSearchResults(); // Clear results if query is too short
      }
    }
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
              onKeyDown={handleSearchKeyDown} // Add onKeyDown handler
            />
            <ul>
            {searchResults && searchResults.length > 0? ( // Check if there are search results
            searchResults.map((player) => (
                <li key={player.id}>
                  {player.username} 
                  <button onClick={() => {/* Handle invite logic */}}>Invite</button>
                </li>
              ))
            ): (
              <li> No users found.</li> 
            )}
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