import React from 'react';
import './SessionList.css'; // Import your CSS file for styling

function SessionList({ title, sessions }) {
  return (
    <div className="session-list">
      <h2>{title}</h2>
      <ul>
        {sessions && sessions.map((session, index) => (
          <li key={index} className="session-item">
            <div>
              <strong>Session {index}:</strong> {session.date}
            </div>
            <div>
              <strong>Players:</strong> {session.players.join(', ')}
            </div>
            {/* Add more session details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SessionList;