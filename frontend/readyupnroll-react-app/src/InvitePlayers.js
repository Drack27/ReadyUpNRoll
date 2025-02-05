import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./InvitePlayers.css";
import TopBar from "./TopBar";

function InvitePlayers() {
  const { worldId } = useParams();
  const [worldName, setWorldName] = useState("");
  const [invitedPlayers, setInvitedPlayers] = useState([]);
  const [joinedPlayers, setJoinedPlayers] = useState([]); // Implement the /api/worlds/:worldId/joined route for this
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false); // New state variable

  useEffect(() => {
    const fetchWorldData = async () => {
      try {
        const worldResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/worldsgm/${worldId}`
        );
        if (!worldResponse.ok) {
          throw new Error("Failed to fetch world data");
        }
        const worldData = await worldResponse.json();
        setWorldName(worldData.name);

        const invitedResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/worldsgm/${worldId}/invited`
        );
        if (!invitedResponse.ok) {
          throw new Error("Failed to fetch invited players");
        }
        const invitedData = await invitedResponse.json();
        setInvitedPlayers(invitedData);

        // Fetch joined players (you need to implement the backend route for this)
        // const joinedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/worlds/${worldId}/joined`);
        // if (!joinedResponse.ok) {
        //   throw new Error('Failed to fetch joined players');
        // }
        // const joinedData = await joinedResponse.json();
        // setJoinedPlayers(joinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchWorldData();
  }, [worldId]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setSearchPerformed(false); // Reset searchPerformed when input changes
    if (event.target.value.length === 0) {
      setSearchResults([]); // Clear results when the search box is empty
    }
  };

  const handleSearchKeyDown = async (event) => {
    if (event.key === "Enter") {
      setSearchPerformed(true); // Set searchPerformed to true when Enter is pressed
      const query = event.target.value;

      if (query.length >= 3) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/users/search?q=${query}`
          );
          if (!response.ok) {
            throw new Error("Failed to search users");
          }
          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error("Error searching users:", error);
        }
      } else {
        setSearchResults([]);
      }
    }
  };

  const handleInvite = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/worldsgm/${worldId}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send invite");
      }

      // Update the invitedPlayers list
      const invitedUser = searchResults.find((u) => u.id === userId);
      setInvitedPlayers([...invitedPlayers, invitedUser]);

      // Remove the invited user from the search results
      setSearchResults(searchResults.filter((u) => u.id !== userId));

      // Display a success message to the user (consider using a more user-friendly notification)
      alert("Invite sent successfully");
    } catch (error) {
      console.error("Error sending invite:", error);
      // Display an error message to the user
      alert("Failed to send invite");
    }
  };

  return (
    <div className="invite-players-page">
      <TopBar />

      <div className="invite-players-content">
        <h1>Manage Players in {worldName}</h1>

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
              {searchResults.length > 0 &&
                searchResults.map((player) => (
                  <li key={player.id}>
                    {player.username}
                    <button onClick={() => handleInvite(player.id)}>
                      Invite
                    </button>
                  </li>
                ))}

              {/* Conditional messaging */}
              {searchPerformed && searchResults.length === 0 && (
                <li>No users found.</li>
              )}
              {!searchPerformed && searchQuery.length > 0 && (
                <li>Type at least 3 characters, then press enter to search</li>
              )}
              {searchQuery.length === 0 && (
                <li>Type at least 3 characters, then press enter to search</li>
              )}
            </ul>
          </div>

          {/* Invited Players List */}
          <div className="player-list">
            <h2>
              Players You've Invited to {worldName} that haven't yet joined
            </h2>
            <ul>
              {invitedPlayers.length > 0 ? ( // Conditionally render based on invitedPlayers length
                invitedPlayers.map((player) => (
                  <li key={player.id}>
                    {player.username}
                    {/* Add a button to cancel invite if you implement that functionality */}
                    {/* <button onClick={() => handleCancelInvite(player.id)}>Cancel Invite</button> */}
                  </li>
                ))
              ) : (
                <li>No invited nonmembers</li> // Message when no invited players
              )}
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