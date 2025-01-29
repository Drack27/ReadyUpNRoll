// InvitePlayers.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './InvitePlayers.css';
import TopBar from './TopBar';

function InvitePlayers() {
  const { worldId } = useParams();
  const [worldName, setWorldName] = useState('');
  const [invitedPlayers, setInvitedPlayers] = useState([]);
  const [joinedPlayers, setJoinedPlayers] = useState([]); // You'll need to implement the /api/worlds/:worldId/joined route for this
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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

        // Fetch joined players (you need to implement the backend route for this)
        // const joinedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/worlds/${worldId}/joined`);
        // if (!joinedResponse.ok) {
        //   throw new Error('Failed to fetch joined players');
        // }
        // const joinedData = await joinedResponse.json();
        // setJoinedPlayers(joinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchWorldData();
  }, [worldId]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyDown = async (event) => {
    if (event.key === 'Enter') {
      const query = event.target.value;

      if (query.length >= 3) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/search?q=${query}`);
          if (!response.ok) {
            throw new Error('Failed to search users');
          }
          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error('Error searching users:', error);
        }
      } else {
        setSearchResults([]);
      }
    }
  };

  const handleInvite = async (userId) => {
    try {
      // Find the user's email from the search results (or fetch it if necessary)
      const user = searchResults.find(u => u.id === userId);
      if (!user) {
        console.error('User not found');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/worldsgm/${worldId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }), // Assuming you have the email field
      });

      if (!response.ok) {
        throw new Error('Failed to send invite');
      }

      // Update the invitedPlayers list
      setInvitedPlayers([...invitedPlayers, user]);

      // Optionally, remove the invited user from the search results
      setSearchResults(searchResults.filter(u => u.id !== userId));

      // TODO: Display a success message to the user
    } catch (error) {
      console.error('Error sending invite:', error);
      // TODO: Display an error message to the user
    }
  };

  return (
    <div className="invite-players-page">
      <TopBar />

      <div className="invite-players-content">
        <h1>Manage Players in {worldName}</h1>

        {/* ... (Rest of your JSX) */}

        <div className="player-lists">
          {/* Searchable Player List */}
          <div className="player-list">
            <input
              type="text"
              placeholder="Search players"
              className="search-bar"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown}
            />
            <ul>
              {searchResults && searchResults.length > 0 ? (
                searchResults.map((player) => (
                  <li key={player.id}>
                    {player.username}
                    <button onClick={() => handleInvite(player.id)}>Invite</button>
                  </li>
                ))
              ) : (
                <li>No users found.</li>
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
                  {/* Add a button to cancel invite if you implement that functionality */}
                  {/* <button onClick={() => handleCancelInvite(player.id)}>Cancel Invite</button> */}
                </li>
              ))}
            </ul>
          </div>

          {/* Joined Players List (You'll need to implement the /api/worlds/:worldId/joined route) */}
          {/* <div className="player-list">
            <h2>Players that have joined {worldName}</h2>
            <ul>
              {joinedPlayers.map((player) => (
                <li key={player.id}>
                  {player.username}
                  <button onClick={() => handleRemovePlayer(player.id)}>Remove Player</button>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default InvitePlayers;