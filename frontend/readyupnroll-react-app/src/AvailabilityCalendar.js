// AvailabilityCalendar.js
import React, { useState, useEffect, useRef } from 'react';
import './AvailabilityCalendar.css'; // Separate CSS file

function AvailabilityCalendar({ initialAvailability, onAvailabilityChange, viewMode, currentDate, setViewMode, handleNext, handlePrevious }) {
    const [availability, setAvailability] = useState(initialAvailability || {});
    const [isPainting, setIsPainting] = useState(false);
    const [paintMode, setPaintMode] = useState(null);
    const calendarRef = useRef(null);

    // Deep comparison of availability objects
    const areAvailabilitiesEqual = (prevAvailability, currentAvailability) => {
        if (prevAvailability === currentAvailability) return true; // Same object reference
        if (!prevAvailability || !currentAvailability) return false; // One is null/undefined
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

    // Update local availability when initialAvailability prop changes, *only if content changed*
    useEffect(() => {
        if (!areAvailabilitiesEqual(availability, initialAvailability)) {
            setAvailability(initialAvailability || {});
        }
    }, [initialAvailability]); // Only depend on initialAvailability


    // Call onAvailabilityChange AFTER availability state has been updated
    useEffect(() => {
        onAvailabilityChange(availability);
    }, [availability]); // onAvailabilityChange removed


    const generateTimeSlots = (mode) => {
        let slots = [];
        const startDate = new Date(currentDate);

        if (mode === 'day') {
            startDate.setHours(0, 0, 0, 0);
            for (let i = 0; i < 24 * 60; i++) {
                const time = new Date(startDate.getTime() + i * 60 * 1000);
                slots.push(time);
            }
        } else if (mode === 'week') {
            startDate.setDate(startDate.getDate() - startDate.getDay());
            for (let i = 0; i < 7 * 24; i++) {
                const time = new Date(startDate.getTime() + i * 60 * 60 * 1000);
                slots.push(time);
            }
        } else if (mode === 'month') {
            startDate.setDate(1);
            const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
            for (let i = 0; i < daysInMonth * 4; i++) {
                const time = new Date(startDate.getTime() + i * 6 * 60 * 60 * 1000);
                slots.push(time);
            }
        } else if (mode === 'year') {
            startDate.setMonth(0, 1);
            for (let i = 0; i < 365; i++) {
                const time = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
                slots.push(time);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots(viewMode);

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
            setPaintMode(initialPaintMode);
            return newAvailability; // Return the updated state
        });
    };

    const handleCellHover = (time) => {
        if (!isPainting) return;

        const dateString = time.toISOString().split('T')[0];
        const timeString = time.toISOString().split('T')[1].substring(0, 5);

        setAvailability(prevAvailability => { // Use the functional update form
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
            return newAvailability; // Return the updated state
        });
    };
    const isCellSelected = (time) => {
        const dateString = time.toISOString().split('T')[0];
        const timeString = time.toISOString().split('T')[1].substring(0, 5);
        return availability[dateString] && availability[dateString].includes(timeString);
    };

    const startPainting = () => {
        setIsPainting(true);
    };

    const stopPainting = () => {
        setIsPainting(false);
        setPaintMode(null);
    };

      useEffect(() => {
        window.addEventListener('mouseup', stopPainting);
        window.addEventListener('touchend', stopPainting);
        return () => {
            window.removeEventListener('mouseup', stopPainting);
            window.removeEventListener('touchend', stopPainting);
        };
    }, []);

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
            <div className="availability-calendar" ref={calendarRef} onMouseLeave={stopPainting}>
                {timeSlots.map((time) => (
                    <div
                        key={time.toISOString()}
                        className={`calendar-cell ${isCellSelected(time) ? 'selected' : ''}`}
                        onMouseDown={() => { startPainting(); handleCellClick(time); }}
                        onMouseEnter={() => handleCellHover(time)}
                        onTouchStart={() => { startPainting(); handleCellClick(time); }}
                        onTouchMove={(e) => {
                            e.preventDefault();
                            const touch = e.touches[0];
                            const element = document.elementFromPoint(touch.clientX, touch.clientY);
                            if (element && element.classList.contains('calendar-cell')) {
                                const timeString = element.getAttribute('key');
                                if (timeString) {
                                    const time = new Date(timeString);
                                    handleCellHover(time);
                                }
                            }
                        }}
                    >
                        {viewMode === 'day' && time.getMinutes() === 0 && time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {viewMode === 'week' && time.getHours() === 0 && time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        {viewMode === 'month' && time.getHours() === 0 && time.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        {viewMode === 'year' && time.getMonth() === 0 && time.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AvailabilityCalendar;