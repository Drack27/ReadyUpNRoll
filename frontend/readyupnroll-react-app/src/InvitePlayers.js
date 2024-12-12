import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './InvitePlayers.css';
import logo from './logo.svg';

function InvitePlayers() {
  const navigate = useNavigate();
  const { worldId } = useParams();
  const [worldName, setWorldName] = useState('');
  const [inviteCodes, setInviteCodes] = useState([]);

  useEffect(() => {
    const fetchWorldName = async () => {
      try {
        const response = await fetch(`/api/worlds/${worldId}`);
        const data = await response.json();
        setWorldName(data.name);
      } catch (error) {
        console.error('Error fetching world name:', error);
        // Handle error (e.g., show an error message)
      }
    };

    fetchWorldName();

    const fetchInviteCodes = async () => {
      try {
        const response = await fetch(`/api/worlds/${worldId}/invite-codes`);
        const data = await response.json();
        setInviteCodes(data);
      } catch (error) {
        console.error('Error fetching invite codes:', error);
        // Handle error
      }
    };

    fetchInviteCodes();

    // Set up WebSocket connection or polling to update codes in real-time
    // ...
  }, [worldId]);

  const handleGenerateCode = async () => {
    try {
      const response = await fetch(`/api/worlds/${worldId}/invite-codes`, {
        method: 'POST',
      });

      if (response.ok) {
        // Update inviteCodes state with the new code (from response)
        // ...
      } else {
        // Handle error (e.g., if code limit reached)
      }
    } catch (error) {
      console.error('Error generating invite code:', error);
      // Handle error
    }
  };

  return (
    <div className="invite-players-page">
      {/* Header */}
      <header className="invite-players-header">
        {/* ... (same as before) ... */}
      </header>

      {/* Invite Players Content */}
      <div className="invite-players-content">
        <h1>Invite Players to {worldName}</h1>

        <p>
          Players should click 'Join a World' on the home screen to find where
          to enter this code. Each code expires after 5 minutes. Each code may
          only be used once. To invite multiple players, generate a code for
          each player you are inviting and send it to them.
        </p>

        <button onClick={handleGenerateCode} disabled={inviteCodes.length >= 10}>
          Generate Code
        </button>

        {/* List of Invite Codes */}
        <ul className="invite-code-list">
          {inviteCodes.map((code) => (
            <li key={code.id} className={code.status}> {/* Add status class */}
              <span className="code">{code.code}</span>
              {/* Display countdown timer for active codes */}
              {code.status === 'active' && (
                <span className="countdown">{formatTime(code.expiresAt)}</span>
              )}
              <span className="status">{code.status}</span> {/* Display status */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Helper function to format time for countdown
const formatTime = (expiresAt) => {
  // ... (Implement your logic to calculate and format the remaining time)
  // This could use a library like moment.js or date-fns
};

export default InvitePlayers;