import React, { useState, useEffect, useCallback } from 'react';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import TimeZoneDropdown from './TimeZoneDropdown';
import './AvailabilityCalendar.css';
import throttle from 'lodash.throttle';
import moment from 'moment-timezone';

function AvailabilityCalendar({ initialAvailability, onAvailabilityChange, viewMode, currentDate, setViewMode, handleNext, handlePrevious }) {
    const [availability, setAvailability] = useState(initialAvailability || {});
    const [isPainting, setIsPainting] = useState(false);
    const [paintMode, setPaintMode] = useState(null);
    const [selectedTimeZone, setSelectedTimeZone] = useState(null);
    const [weekStartsOnMonday, setWeekStartsOnMonday] = useState(true);

    const areAvailabilitiesEqual = (prevAvailability, currentAvailability) => {
        if (prevAvailability === currentAvailability) return true;
        if (!prevAvailability || !currentAvailability) return false;
        if (Object.keys(prevAvailability).length !== Object.keys(currentAvailability).length) return false;

        for (const date in prevAvailability) {
            if (!currentAvailability.hasOwnProperty(date)) return false;
            if (prevAvailability[date] && !currentAvailability[date]) return false;
            if (!prevAvailability[date] && currentAvailability[date]) return false;
            if (prevAvailability[date] && currentAvailability[date] && prevAvailability[date].length !== currentAvailability[date].length) return false;

            // Sort both arrays before comparing
            const prevSorted = [...prevAvailability[date]].sort();
            const currentSorted = [...currentAvailability[date]].sort();

            for (let i = 0; i < prevSorted.length; i++) {
                if (prevSorted[i] !== currentSorted[i]) return false;
            }
        }
        return true;
    };

    useEffect(() => {
        if (!areAvailabilitiesEqual(availability, initialAvailability)) {
            setAvailability(initialAvailability || {});
        }
    }, [initialAvailability, availability]);

    useEffect(() => {
        onAvailabilityChange(availability);
    }, [availability, onAvailabilityChange]);

    const handleCellClick = (time) => {
        const dateString = moment(time).clone().tz(selectedTimeZone).format('YYYY-MM-DD');
        const timeString = moment(time).clone().tz(selectedTimeZone).format('HH:mm');
        console.log("Clicked Cell:", dateString, timeString);

        setAvailability(prevAvailability => {
            console.log("handleCellClick - Previous Availability:", prevAvailability); // LOG PREVIOUS STATE
            const newAvailability = { ...prevAvailability };
            console.log("handleCellClick - dateString:", dateString, "timeString:", timeString); // LOG DATE AND TIME

            if (newAvailability[dateString]) {
                // Toggle the specific time slot
                if (newAvailability[dateString].includes(timeString)) {
                    newAvailability[dateString] = newAvailability[dateString].filter(t => t !== timeString);
                    if (newAvailability[dateString].length === 0) {
                        delete newAvailability[dateString]; // Clean up empty date entries
                    }
                } else {
                    newAvailability[dateString].push(timeString);
                    newAvailability[dateString].sort(); // Keep times sorted
                }
            } else {
                newAvailability[dateString] = [timeString];
            }
            console.log("handleCellClick - New Availability (before set):", newAvailability); // LOG NEW STATE
            return newAvailability;
        });
    };

    const handleCellHover = useCallback(
        throttle((time) => {
            if (!isPainting) return;

            const dateString = moment(time).clone().tz(selectedTimeZone).format('YYYY-MM-DD');
            const timeString = moment(time).clone().tz(selectedTimeZone).format('HH:mm');
            console.log("Hovered Cell (while painting):", dateString, timeString);

            setAvailability(prevAvailability => {
                console.log("handleCellHover - Previous Availability:", prevAvailability); // LOG PREVIOUS STATE
                const newAvailability = { ...prevAvailability };
                console.log("handleCellHover - dateString:", dateString, "timeString:", timeString); // LOG DATE AND TIME

                if (paintMode) { // Add time
                    if (!newAvailability[dateString]) {
                        newAvailability[dateString] = [timeString];
                    } else if (!newAvailability[dateString].includes(timeString)) {
                        newAvailability[dateString].push(timeString);
                        newAvailability[dateString].sort();
                    }
                } else { // Remove time
                    if (newAvailability[dateString]) {
                        newAvailability[dateString] = newAvailability[dateString].filter(t => t !== timeString);
                        if (newAvailability[dateString].length === 0) {
                            delete newAvailability[dateString]; // Clean up empty date entries
                        }
                    }
                }
                console.log("handleCellHover - New Availability (before set):", newAvailability); // LOG NEW STATE
                return newAvailability;
            });
        }, 16, { trailing: true }),
        [isPainting, paintMode, selectedTimeZone]
    );


    const startPainting = (time) => {
        setIsPainting(true);
        const dateString = moment(time).clone().tz(selectedTimeZone).format('YYYY-MM-DD');
        const timeString = moment(time).clone().tz(selectedTimeZone).format('HH:mm');

        // Determine paintMode based on the *initial* state of the cell
        setPaintMode(prevPaintMode => {
            const alreadySelected = availability[dateString] && availability[dateString].includes(timeString);
            return !alreadySelected;
        });
    };
    const stopPainting = () => {
        setIsPainting(false);
        setPaintMode(null);
    };

    useEffect(() => {
        const handleMouseUp = () => {
            stopPainting();
        };
        const handleTouchEnd = () => {
            stopPainting();
        }

        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    const handleTimeZoneChange = (timeZone) => {
        setSelectedTimeZone(timeZone);
    };

    const handleWeekStartToggle = useCallback(() => {
        setWeekStartsOnMonday(prev => !prev);
    }, []);

     // Add this useEffect for logging
    useEffect(() => {
        const logInterval = setInterval(() => {
            console.log("Current Availability:", availability);
        }, 10000); // Log every 10 seconds

        return () => clearInterval(logInterval); // Cleanup on unmount
    }, [availability]); // Depend on availability


    return (
        <div className={`availability-calendar-container ${viewMode === 'week' ? 'week-view-active' : ''}`}>
            <div className="calendar-controls">
                <button onClick={handlePrevious}>&lt; Previous</button>
                <button onClick={() => setViewMode('day')}>Day</button>
                <button onClick={() => setViewMode('week')}>Week</button>
                <button onClick={() => setViewMode('month')}>Month</button>
                <button onClick={() => setViewMode('year')}>Year</button>
                <button onClick={handleNext}>Next &gt;</button>
                <TimeZoneDropdown
                    onTimeZoneChange={handleTimeZoneChange}
                    selectedTimeZone={selectedTimeZone}
                />
            </div>
            {selectedTimeZone ? (
                <>
                    {viewMode === 'day' && (
                        <DayView
                            currentDate={currentDate}
                            availability={availability}
                            onCellClick={handleCellClick}
                            onCellHover={handleCellHover}
                            isPainting={isPainting}
                            startPainting={startPainting}
                            onMouseLeave={stopPainting}
                            selectedTimeZone={selectedTimeZone}
                            weekStartsOnMonday={weekStartsOnMonday}
                            onWeekStartToggle={handleWeekStartToggle}
                        />
                    )}
                    {viewMode === 'week' && (
                        <WeekView
                            currentDate={currentDate}
                            availability={availability}
                            onCellClick={handleCellClick}
                            onCellHover={handleCellHover}
                            isPainting={isPainting}
                            startPainting={startPainting}
                            onMouseLeave={stopPainting}
                            selectedTimeZone={selectedTimeZone}
                            weekStartsOnMonday={weekStartsOnMonday}
                            onWeekStartToggle={handleWeekStartToggle}
                        />
                    )}
                    {viewMode === 'month' && (
                        <MonthView
                            currentDate={currentDate}
                            availability={availability}
                            onCellClick={handleCellClick}
                            onCellHover={handleCellHover}
                            isPainting={isPainting}
                            startPainting={startPainting}
                            onMouseLeave={stopPainting}
                            selectedTimeZone={selectedTimeZone}
                            weekStartsOnMonday={weekStartsOnMonday}
                            onWeekStartToggle={handleWeekStartToggle}
                        />
                    )}
                    {viewMode === 'year' && (
                        <YearView
                            currentDate={currentDate}
                            availability={availability}
                            onCellClick={handleCellClick}
                            onCellHover={handleCellHover}
                            selectedTimeZone={selectedTimeZone}
                            isPainting={isPainting}
                            startPainting={startPainting}
                            onMouseLeave={stopPainting}
                        />
                    )}
                </>

            ) : (
                <div className="timezone-message">Please select a time zone to view the calendar.</div>
            )}
        </div>
    );
}

export default AvailabilityCalendar;