import React, { useState, useCallback } from 'react';
import TopBar from './TopBar';
import SessionList from './SessionList';
import AvailabilityCalendar from './AvailabilityCalendar';
import './ReadyUpScreen.css';
import moment from 'moment-timezone';

function ReadyUpScreen(props) {
    const { worldName, minTime, minPlayers, pastSessions, upcomingSessions, worldDetails } = props;
    const [viewMode, setViewMode] = useState('week');
    const [currentDate, setCurrentDate] = useState(moment.tz(new Date(), "UTC"));
    const [selectedTimeZone, setSelectedTimeZone] = useState(null); // Start with null

    const handleNext = useCallback(() => {
        const newDate = moment(currentDate).tz(selectedTimeZone || "UTC"); // Use UTC if no timezone selected
        if (viewMode === 'day') {
            newDate.add(1, 'day');
        } else if (viewMode === 'week') {
            newDate.add(7, 'days');
        } else if (viewMode === 'month') {
            newDate.add(1, 'month');
        } else if (viewMode === 'year') {
            newDate.add(1, 'year');
        }
        setCurrentDate(newDate);
    }, [currentDate, viewMode, selectedTimeZone]);

    const handlePrevious = useCallback(() => {
        const newDate = moment(currentDate).tz(selectedTimeZone || "UTC"); // Use UTC if no timezone selected
        if (viewMode === 'day') {
            newDate.subtract(1, 'day');
        } else if (viewMode === 'week') {
            newDate.subtract(7, 'days');
        } else if (viewMode === 'month') {
            newDate.subtract(1, 'month');
        } else if (viewMode === 'year') {
            newDate.subtract(1, 'year');
        }
        setCurrentDate(newDate);
    }, [currentDate, viewMode, selectedTimeZone]);

    const handleReadyUpSubmit = () => {
        console.log("Submitting Availability (Eventually will send pendingAvailability)");
        alert("Availability submitted! (Not really, this is a placeholder.)");
    };

    // IMPORTANT:  Update currentDate when a time zone is selected
    const handleTimeZoneChange = useCallback((newTimeZone) => {
        setSelectedTimeZone(newTimeZone);
        setCurrentDate(moment.tz(currentDate, newTimeZone));
    }, [currentDate]);  // currentDate is a dependency


    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const WorldHeader = () => (
        <div className="world-header">
            <h1>ReadyUp for sessions in {worldName}!</h1>
            <p>To Ready Up, paint the calendar...</p>
        </div>
    );

    const WorldDetails = () => (
        worldDetails ?
            <div className="world-details">
                <h2>World Details:</h2>
                <p>Game System: {worldDetails.gameSystem}</p>
                <p>Modules: {worldDetails.modules}</p>
            </div> :
            <div className="world-details">Loading world details...</div>
    );

    return (
        <div className="ready-up-screen">
            <TopBar />
            <WorldHeader />
            <WorldDetails />
            <AvailabilityCalendar
                viewMode={viewMode}
                currentDate={currentDate.toDate()}
                setViewMode={setViewMode}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                initialTimeZone={selectedTimeZone} // Pass initial timezone
                onTimeZoneChange={handleTimeZoneChange} // Pass timezone change handler
            />
            <button className="ready-up-button" onClick={handleReadyUpSubmit}>ReadyUp! (submit availability)</button>

            <div className="session-lists">
                <SessionList title="Past Sessions" sessions={pastSessions || []} formatDate={formatDate} />
                <SessionList title="Upcoming Sessions" sessions={upcomingSessions || []} formatDate={formatDate} />
            </div>
        </div>
    );
}

export default ReadyUpScreen;