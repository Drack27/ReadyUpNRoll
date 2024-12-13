import React from 'react';
import './JoinWorldSuccess.css';

function JoinWorldSuccess({ worldName }) {
  const handleAdventureBegin = () => {
    // Handle navigation to Ready Up page for the joined world
  };

  return (
    <div className="join-world-success">
      <h1>You have joined {worldName}!</h1>
      <button className="adventure-button" onClick={handleAdventureBegin}>
        Let the Adventure Begin!
      </button>
    </div>
  );
}

export default JoinWorldSuccess;