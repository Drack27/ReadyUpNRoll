import React from 'react';
import { Link } from 'react-router-dom';
import './LeaveWorldConfirmation.css'; // Reusing the CSS file

function LeaveWorldSuccess({ worldName }) {
  return (
    <div className="leave-world-confirmation"> {/* Reusing the same class */}
      <h1 className="confirmation-header">You have left {worldName}</h1>
      <Link to='/home'>
      <button className="cancel-button" onClick={() => { /* Handle navigation to Home Screen */ }}>
        Return to Home Screen
      </button>
      </Link>
    </div>
  );
}

export default LeaveWorldSuccess;