import React from 'react';
import TopBar from './TopBar'; // Assuming you have the TopBar component
import './AvailabilitySubmitted.css'; // Import your CSS file
import SessionList from './SessionList';

function AvailabilitySubmitted(props) {
  const { worldName, pendingSessions, bookedSessions } = props;

  return (
    <div className="availability-submitted">
      <TopBar />
      <img src="/nice.jpg" alt="Success" className="success-image" />

      <section className="session-lists-section">
        <h2>You are now ready for the following sessions:</h2>

        <div className="session-lists">
          <SessionList title="These ones aren't booked yet" sessions={pendingSessions} />
          <SessionList title="These ones are now booked because of you!" sessions={bookedSessions} />
        </div>
      </section>

      <div className="buttons">
        <button className="return-button" onClick={() => { /* Handle navigation to Home Screen */ }}>
          Return to Home Screen
        </button>
        <button className="return-button" onClick={() => { /* Handle navigation to ReadyUp screen */ }}>
          Return to ReadyUp screen for {worldName}
        </button>
      </div>
    </div>
  );
}

export default AvailabilitySubmitted;