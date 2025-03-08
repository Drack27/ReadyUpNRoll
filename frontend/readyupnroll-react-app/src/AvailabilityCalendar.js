import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import TimeZoneDropdown from './TimeZoneDropdown';
import './AvailabilityCalendar.css';
import throttle from 'lodash.throttle';
import moment from 'moment-timezone';

function AvailabilityCalendar({ currentDate, setViewMode, viewMode, handleNext, handlePrevious, initialTimeZone, onTimeZoneChange }) { //Removed props
    const [submittedAvailability, setSubmittedAvailability] = useState({}); // Now internal state
    const [pendingAvailability, setPendingAvailability] = useState({});
    const [isPainting, setIsPainting] = useState(false);
    const [paintMode, setPaintMode] = useState(null);
    const [selectedTimeZone, setSelectedTimeZone] = useState(initialTimeZone || "UTC"); // Use initialTimeZone prop, default to UTC
    const [weekStartsOnMonday, setWeekStartsOnMonday] = useState(true);


     // Simulate fetching submitted availability on mount
    useEffect(() => {
        const simulatedFetchedAvailability = {
            "2025-03-08": ["10:00", "11:00"], // Your simulated data
            "2025-03-09": ["14:00", "15:00"]
        };
        setSubmittedAvailability(simulatedFetchedAvailability);
    }, []); // Empty dependency array: runs only once on mount

    // Combined Availability (remains the same)
    const combinedAvailability = useMemo(() => {
        const combined = { ...submittedAvailability };

        for (const date in pendingAvailability) {
            if (pendingAvailability[date]) {
                combined[date] = pendingAvailability[date];
            } else {
              delete combined[date]
            }
        }

        return combined;
    }, [submittedAvailability, pendingAvailability]);

    const handleCellClick = (time) => {
        const dateString = moment(time).clone().tz(selectedTimeZone).format('YYYY-MM-DD');
        const timeString = moment(time).clone().tz(selectedTimeZone).format('HH:mm');
        console.log("Clicked Cell:", dateString, timeString);

        setPendingAvailability(prevPending => {
            const newPending = { ...prevPending };

            if (newPending[dateString]) {
                if (newPending[dateString].includes(timeString)) {
                    newPending[dateString] = newPending[dateString].filter(t => t !== timeString);
                    if (newPending[dateString].length === 0) {
                        delete newPending[dateString];
                    }
                } else {
                    newPending[dateString].push(timeString);
                    newPending[dateString].sort();
                }
            } else {
                newPending[dateString] = [timeString];
            }
            console.log("handleCellClick - New Pending Availability (before set):", JSON.stringify(newPending, null, 2));
            return newPending;
        });
    };

    const handleCellHover = useCallback(
        throttle((time) => {
            if (!isPainting) return;

            const dateString = moment(time).clone().tz(selectedTimeZone).format('YYYY-MM-DD');
            const timeString = moment(time).clone().tz(selectedTimeZone).format('HH:mm');
            console.log("Hovered Cell (while painting):", dateString, timeString);

            setPendingAvailability(prevPending => {
                const newPending = { ...prevPending };

                if (paintMode) {
                    if (!newPending[dateString]) {
                        newPending[dateString] = [timeString];
                    } else if (!newPending[dateString].includes(timeString)) {
                        newPending[dateString].push(timeString);
                        newPending[dateString].sort();
                    }
                } else {
                    if (newPending[dateString]) {
                        newPending[dateString] = newPending[dateString].filter(t => t !== timeString);
                        if (newPending[dateString].length === 0) {
                            delete newPending[dateString];
                        }
                    }
                }
                console.log("handleCellHover - New Pending Availability (before set):", JSON.stringify(newPending, null, 2));
                return newPending;
            });
        }, 16, { trailing: true }),
        [isPainting, paintMode, selectedTimeZone]
    );

    const startPainting = (time) => {
        setIsPainting(true);
        const dateString = moment(time).clone().tz(selectedTimeZone).format('YYYY-MM-DD');
        const timeString = moment(time).clone().tz(selectedTimeZone).format('HH:mm');
        setPaintMode(prevPaintMode => {
          const alreadySelected = combinedAvailability[dateString] && combinedAvailability[dateString].includes(timeString);
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

    // No longer needed, handled via prop
    // const handleTimeZoneChange = (timeZone) => {
    //     setSelectedTimeZone(timeZone);
    // };
     useEffect(() => {
        setSelectedTimeZone(initialTimeZone)
    }, [initialTimeZone]);

    const handleWeekStartToggle = useCallback(() => {
        setWeekStartsOnMonday(prev => !prev);
    }, []);

    useEffect(() => {
        const logInterval = setInterval(() => {
            console.log("Current Submitted Availability:", submittedAvailability);
            console.log("Current Pending Availability:", pendingAvailability);
        }, 10000);

        return () => clearInterval(logInterval);
    }, [submittedAvailability, pendingAvailability]);

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
                    onTimeZoneChange={onTimeZoneChange}
                    selectedTimeZone={selectedTimeZone}
                />
            </div>
            {selectedTimeZone ? (
                <>
                    {viewMode === 'day' && (
                        <DayView
                            currentDate={currentDate}
                            availability={combinedAvailability}
                            onCellClick={handleCellClick}
                            onCellHover={handleCellHover}
                            isPainting={isPainting}
                            startPainting={startPainting}
                            stopPainting={stopPainting}
                            selectedTimeZone={selectedTimeZone}
                            weekStartsOnMonday={weekStartsOnMonday}
                            onWeekStartToggle={handleWeekStartToggle}
                        />
                    )}
                    {viewMode === 'week' && (
                        <WeekView
                            currentDate={currentDate}
                            availability={combinedAvailability}
                            onCellClick={handleCellClick}
                            onCellHover={handleCellHover}
                            isPainting={isPainting}
                            startPainting={startPainting}
                            stopPainting={stopPainting}
                            selectedTimeZone={selectedTimeZone}
                            weekStartsOnMonday={weekStartsOnMonday}
                            onWeekStartToggle={handleWeekStartToggle}
                        />
                    )}
                     {viewMode === 'month' && (
                        <MonthView
                            currentDate={currentDate}
                            availability={combinedAvailability}
                            onCellClick={handleCellClick}
                            onCellHover={handleCellHover}
                            isPainting={isPainting}
                            startPainting={startPainting}
                            stopPainting={stopPainting}
                            selectedTimeZone={selectedTimeZone}
                            weekStartsOnMonday={weekStartsOnMonday}
                            onWeekStartToggle={handleWeekStartToggle}
                        />
                    )}
                    {viewMode === 'year' && (
                         <YearView
                            currentDate={currentDate}
                            availability={combinedAvailability}
                            onCellClick={handleCellClick}
                            onCellHover={handleCellHover}
                            selectedTimeZone={selectedTimeZone}
                            isPainting={isPainting}
                            startPainting={startPainting}
                            stopPainting={stopPainting}
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