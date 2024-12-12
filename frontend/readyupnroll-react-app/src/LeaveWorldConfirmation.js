import React from 'react';
import './LeaveWorldConfirmation.css'; // Import your CSS file

function LeaveWorldConfirmation() {
  return (
    <div className="leave-world-confirmation">
      <h1 className="confirmation-header">Are you sure?</h1>
      <p className="confirmation-text">
        If this is a private world, you won't be able to re-join unless the GM sends you another single-use invite code.
      </p>
      <div className="buttons">
        <button className="cancel-button" onClick={() => { /* Handle cancellation - e.g., go back */ }}>
          Waiwaiwait, hold up
        </button>
        <button className="leave-button" onClick={() => { /* Handle leaving the world */ }}>
          Get me the FRICK outta here
        </button>
      </div>
    </div>
  );
}

export default LeaveWorldConfirmation;