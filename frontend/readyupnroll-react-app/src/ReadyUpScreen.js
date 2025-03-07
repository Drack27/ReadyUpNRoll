import React, { useState, useCallback, useMemo } from 'react';
import TopBar from './TopBar';
import SessionList from './SessionList';
import AvailabilityCalendar from './AvailabilityCalendar';
import './ReadyUpScreen.css';
import moment from 'moment-timezone'; // Import moment-timezone

function ReadyUpScreen(props) {
    const { worldName, minTime, minPlayers, pastSessions, upcomingSessions, worldDetails } = props;
    const [availability, setAvailability] = useState({});
    const [viewMode, setViewMode] = useState('week');
    // Initialize currentDate with moment-timezone, defaulting to UTC
    const [currentDate, setCurrentDate] = useState(moment.tz(new Date(), "UTC"));
    const [selectedTimeZone, setSelectedTimeZone] = useState("UTC"); // Add selectedTimeZone

    // Update handleNext to use moment-timezone
    const handleNext = useCallback(() => {
        const newDate = moment(currentDate).tz(selectedTimeZone); // Use moment-timezone
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

    // Update handlePrevious to use moment-timezone
    const handlePrevious = useCallback(() => {
        const newDate = moment(currentDate).tz(selectedTimeZone); // Use moment-timezone
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
        console.log("Submitting Availability:", availability);
        alert("Availability submitted! (Not really, this is a placeholder.)");
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleAvailabilityChange = useCallback((newAvailability) => {
        setAvailability(newAvailability);
    }, []);

    const handleTimeZoneChange = useCallback((newTimeZone) => { // Add handleTimeZoneChange
        setSelectedTimeZone(newTimeZone);
        setCurrentDate(moment.tz(currentDate, newTimeZone)); // Update currentDate to new timezone
    }, [currentDate]);

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


    // Use useMemo to memoize the initialAvailability prop
    const memoizedInitialAvailability = useMemo(() => {
        return {}; // Or any initial value you want
    }, []); // Empty dependency array: only create once!

    return (
        <div className="ready-up-screen">
            <TopBar />
            <WorldHeader />
            <WorldDetails />
            <AvailabilityCalendar
                initialAvailability={memoizedInitialAvailability} // Use the memoized value
                onAvailabilityChange={handleAvailabilityChange}
                viewMode={viewMode}
                currentDate={currentDate.toDate()} // Pass as Date object
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