// AvailabilityCalendar.js
import React, { useState, useEffect, useCallback } from 'react';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import TimeZoneDropdown from './TimeZoneDropdown';
import './AvailabilityCalendar.css';
import throttle from 'lodash.throttle';

function AvailabilityCalendar({ initialAvailability, onAvailabilityChange, viewMode, currentDate, setViewMode, handleNext, handlePrevious }) {
    const [availability, setAvailability] = useState(initialAvailability || {});
    const [isPainting, setIsPainting] = useState(false);
    const [paintMode, setPaintMode] = useState(null);
    const [selectedTimeZone, setSelectedTimeZone] = useState(null);

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

    // Update local availability ONLY when initialAvailability prop changes *from the parent*
    useEffect(() => {
        if (!areAvailabilitiesEqual(availability, initialAvailability)) {
                setAvailability(initialAvailability || {});
            }
    }, [initialAvailability]); // Removed 'availability' from dependencies!

    // Notify parent component when availability changes
    useEffect(() => {
        onAvailabilityChange(availability);
    }, [availability, onAvailabilityChange]);

  const handleCellClick = (time) => {
    const dateString = time.clone().tz(selectedTimeZone).format('YYYY-MM-DD');
    const timeString = time.clone().tz(selectedTimeZone).format('HH:mm');

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
        setPaintMode(initialPaintMode); // Correct placement
        return newAvailability;
    });
};


const handleCellHover = useCallback(
    throttle((time) => {
        if (!isPainting) return;

        const dateString = time.clone().tz(selectedTimeZone).format('YYYY-MM-DD'); //TZ Fix
        const timeString = time.clone().tz(selectedTimeZone).format('HH:mm'); //TZ Fix

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
            } else { // paintMode === false
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
    }, 16),
    [isPainting, paintMode] // Corrected dependencies
);

    const startPainting = () => { setIsPainting(true); };
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

    return (
        <div className={`availability-calendar-container ${viewMode === 'day' ? 'day-view-active' : ''}`}>
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
                        selectedTimeZone={selectedTimeZone}
                        />
                    )}
                </>
            ) : (
                <div className="timezone-message">
                    You gotta pick a timezone before you can see the calendar.
                </div>
            )}
        </div>
    );
}

export default AvailabilityCalendar;