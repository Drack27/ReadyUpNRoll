//SessionList.js
import React from 'react';
import './SessionList.css';

function SessionList({ title, sessions, formatDate }) {
  return (
    <div className="session-list">
      <h2>{title}</h2>
      {sessions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Session #</th>
              <th>Date & Time</th>
              <th>Attendees</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <tr key={index}>
                <td>{session.sessionNumber}</td>
                <td>{formatDate(session.dateTime)}</td>
                <td>
                    <strong>GM:</strong> {session.gm}<br/>
                    {session.players.map((player, pIndex) => (
                      <React.Fragment key={pIndex}>
                        {player}{pIndex < session.players.length -1 && ', ' }
                        </React.Fragment>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No sessions to display.</p>
      )}
    </div>
  );
}

export default SessionList;