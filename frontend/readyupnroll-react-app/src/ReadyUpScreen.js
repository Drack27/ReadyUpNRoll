// ReadyUpScreen.js (CORRECTED with useMemo)
import React, { useState, useCallback, useMemo } from 'react'; // Import useMemo
import TopBar from './TopBar';
import SessionList from './SessionList';
import AvailabilityCalendar from './AvailabilityCalendar';
import './ReadyUpScreen.css';

function ReadyUpScreen(props) {
    const { worldName, minTime, minPlayers, pastSessions, upcomingSessions, worldDetails } = props;
    const [availability, setAvailability] = useState({});
    const [viewMode, setViewMode] = useState('week');
    const [currentDate, setCurrentDate] = useState(new Date());

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'day') {
            newDate.setDate(newDate.getDate() + 1);
        } else if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + 7);
        } else if (viewMode === 'month') {
            newDate.setMonth(newDate.getMonth() + 1);
        } else if (viewMode === 'year') {
            newDate.setFullYear(newDate.getFullYear() + 1);
        }
        setCurrentDate(newDate);
    };

    const handlePrevious = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'day') {
            newDate.setDate(newDate.getDate() - 1);
        } else if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() - 7);
        } else if (viewMode === 'month') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else if (viewMode === 'year') {
            newDate.setFullYear(newDate.getFullYear() - 1);
        }
        setCurrentDate(newDate);
    };

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
                currentDate={currentDate}
                setViewMode={setViewMode}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
            />
            <button className="ready-up-button" onClick={handleReadyUpSubmit}>ReadyUp! (submit availability)</button>

            <div className="session-lists">
                <SessionList title="Past Sessions" sessions={pastSessions || []} formatDate={formatDate}/>
                <SessionList title="Upcoming Sessions" sessions={upcomingSessions || []} formatDate={formatDate}/>
            </div>
        </div>
    );
}

export default ReadyUpScreen;