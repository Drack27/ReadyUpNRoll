// AvailabilityCalendar.js
import React, { useState, useEffect, useRef } from 'react';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import './AvailabilityCalendar.css';

function AvailabilityCalendar({ initialAvailability, onAvailabilityChange, viewMode, currentDate, setViewMode, handleNext, handlePrevious }) {
    const [availability, setAvailability] = useState(initialAvailability || {});
    const [isPainting, setIsPainting] = useState(false);
    const [paintMode, setPaintMode] = useState(null);
    const calendarRef = useRef(null); //Might not be needed anymore, but keeping just in case

    // Deep comparison of availability objects (utility function)
    const areAvailabilitiesEqual = (prevAvailability, currentAvailability) => {
        if (prevAvailability === currentAvailability) return true;
        if (!prevAvailability || !currentAvailability) return false;
        if (Object.keys(prevAvailability).length !== Object.keys(currentAvailability).length) return false;

        for (const date in prevAvailability) {
            if (!currentAvailability.hasOwnProperty(date)) return false;
            if (prevAvailability[date].length !== currentAvailability[date].length) return false;
            for (let i = 0; i < prevAvailability[date].length; i++) {
                if (prevAvailability[date][i] !== currentAvailability[date][i]) return false;
            }
        }
        return true;
    };

    // Update local availability when initialAvailability prop changes (only if different)
    useEffect(() => {
        if (!areAvailabilitiesEqual(availability, initialAvailability)) {
            setAvailability(initialAvailability || {});
        }
    }, [initialAvailability, availability]);

    // Notify parent component when availability changes
    useEffect(() => {
        onAvailabilityChange(availability);
    }, [availability, onAvailabilityChange]);

    // --- Event Handlers (passed down to child views) ---

    const handleCellClick = (time) => {
        const dateString = time.toISOString().split('T')[0];
        const timeString = time.toISOString().split('T')[1].substring(0, 5);

        setAvailability(prevAvailability => {
            const newAvailability = { ...prevAvailability };
            let initialPaintMode;

            if (!newAvailability[dateString]) {
                newAvailability[dateString] = [timeString];
                initialPaintMode = true;
            } else {
                const existingTimes = newAvailability[dateString];
                if (existingTimes.includes(timeString)) {
                    newAvailability[dateString] = existingTimes.filter(t => t !== timeString);
                    initialPaintMode = false;
                    if (newAvailability[dateString].length === 0) {
                        delete newAvailability[dateString];
                    }
                } else {
                    newAvailability[dateString] = [...existingTimes, timeString].sort();
                    initialPaintMode = true;
                }
            }
            setPaintMode(initialPaintMode); // Set the paint mode *here*
            return newAvailability;
        });
    };

    const handleCellHover = (time) => {
        if (!isPainting) return;

        const dateString = time.toISOString().split('T')[0];
        const timeString = time.toISOString().split('T')[1].substring(0, 5);

        setAvailability(prevAvailability => {
            const newAvailability = { ...prevAvailability };

            if (paintMode === true) {
                if (!newAvailability[dateString]) {
                    newAvailability[dateString] = [timeString];
                } else {
                    const existingTimes = newAvailability[dateString];
                    if (!existingTimes.includes(timeString)) {
                        newAvailability[dateString] = [...existingTimes, timeString].sort();
                    }
                }
            } else {
                if (newAvailability[dateString]) {
                    const existingTimes = newAvailability[dateString];
                    if (existingTimes.includes(timeString)) {
                        newAvailability[dateString] = existingTimes.filter(t => t !== timeString);
                        if (newAvailability[dateString].length === 0) {
                            delete newAvailability[dateString];
                        }
                    }
                }
            }
            return newAvailability;
        });
    };


    const startPainting = () => { setIsPainting(true); };
    const stopPainting = () => {
        setIsPainting(false);
        setPaintMode(null); // Reset paint mode
     };

    // --- Global Mouse/Touch Event Handlers ---
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
    }, []); // Empty dependency array: run once on mount/unmount


    return (
        <div className="availability-calendar-container">
            <div className="calendar-controls">
                <button onClick={handlePrevious}>&lt; Previous</button>
                <button onClick={() => setViewMode('day')}>Day</button>
                <button onClick={() => setViewMode('week')}>Week</button>
                <button onClick={() => setViewMode('month')}>Month</button>
                <button onClick={() => setViewMode('year')}>Year</button>
                <button onClick={handleNext}>Next &gt;</button>
            </div>

            {/* Conditionally render the appropriate view component */}
            {viewMode === 'day' && (
                <DayView
                    currentDate={currentDate}
                    availability={availability}
                    onCellClick={handleCellClick}
                    onCellHover={handleCellHover}
                    isPainting={isPainting}
                    startPainting={startPainting}
                    onMouseLeave={stopPainting}
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
                />
            )}
            {viewMode === 'year' && (
                <YearView
                    currentDate={currentDate}
                    availability={availability}
                    onCellClick={handleCellClick}
                    onCellHover={handleCellHover}
                    isPainting={isPainting}
                    startPainting={startPainting}
                    onMouseLeave={stopPainting}
                />
            )}
        </div>
    );
}

export default AvailabilityCalendar;