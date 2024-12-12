import React from 'react';
import TopBar from './TopBar';
import AvailabilityCalendar from './AvailabilityCalendar';
import SessionList from './SessionList';
import './ReadyUpScreen.css';

function ReadyUpScreen(props) {
  const { worldName, minTime, minPlayers, pastSessions, upcomingSessions, worldDetails } = props;

  const WorldHeader = () => (
    <div className="world-header">
      <h1>ReadyUp for sessions in {worldName}!</h1>
      <p>
        To Ready Up, paint the calendar with your availability. When there's an overlap of at least {minTime} and at least {minPlayers} people, a session will be automatically booked! You'll get an email whenever a session is booked, and reminder emails 24 hours and 30 minutes before the session starts. Keep an eye on your notifications!
      </p>
    </div>
  );

  const WorldDetails = () => (
    <div className="world-details">
      <h2>World Details:</h2>
      {/* Assuming worldDetails is an object with properties like gameSystem, modules, etc. */}
      <p>Game System: {worldDetails.gameSystem}</p> 
      <p>Modules: {worldDetails.modules}</p>
      {/* Add more details as needed */}
    </div>
  );

  return (
    <div className="ready-up-screen">
      <TopBar />
      <WorldHeader />
      <AvailabilityCalendar />
      <button className="ready-up-button">ReadyUp! (submit availability)</button>
      <div className="session-lists">
        <SessionList title="Past Sessions" sessions={pastSessions || []} /> 
        <SessionList title="Upcoming Sessions" sessions={upcomingSessions || []} /> 
      </div>
    </div>
  );
}

export default ReadyUpScreen;