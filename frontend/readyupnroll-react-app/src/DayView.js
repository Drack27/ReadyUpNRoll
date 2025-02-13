// DayView.js
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import './DayView.css';

function DayView({ currentDate, availability, onCellClick, onCellHover, isPainting, startPainting, onMouseLeave }) {
    const [isNarrow, setIsNarrow] = useState(window.innerWidth <= 768); // Initial narrow mode check

    // Update isNarrow state on window resize
    useEffect(() => {
        const handleResize = () => {
            setIsNarrow(window.innerWidth <= 768); // Adjust breakpoint as needed
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const generateTimeSlots = () => {
        let slots = [];
        const startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0);
        for (let i = 0; i < 24; i++) { // Iterate through hours
            for (let j = 0; j < 4; j++) { // Iterate through 15-minute intervals
                const time = new Date(startDate.getTime() + (i * 60 + j * 15) * 60 * 1000);
                slots.push(time);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const isCellSelected = (time) => {
        const dateString = time.toISOString().split('T')[0];
        const timeString = time.toISOString().split('T')[1].substring(0, 5);
        return availability[dateString] && availability[dateString].includes(timeString);
    };

    let lastHoveredCell = null;

    return (
        <>
            <h3>{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            <div className={`availability-calendar-container day-view-override availability-calendar day-view ${isNarrow ? 'narrow-view' : 'wide-view'}`} onMouseLeave={onMouseLeave}>
                {timeSlots.map((time) => {
                    const hour = time.getHours();
                    const minute = time.getMinutes();
                    const isHourStart = minute === 0;
                    const isMidday = hour === 12 && minute === 0; // Check for 12:00 PM

                    return (
                        <div
                            key={time.toISOString()}
                            className={`calendar-cell ${isCellSelected(time) ? 'selected' : ''} ${isHourStart ? 'hour-start' : ''} ${isMidday ? 'midday-divider' : ''}`}
                            onMouseDown={() => { startPainting(); onCellClick(time); }}
                            onMouseEnter={() => onCellHover(time)}
                            onTouchStart={() => { startPainting(); onCellClick(time); }}
                            onTouchMove={(e) => {
                                e.preventDefault();
                                const touch = e.touches[0];
                                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                                if (element && element.classList.contains('calendar-cell')) {
                                    const timeString = element.getAttribute('key');
                                    if (timeString) {
                                        try {
                                            const currentTime = new Date(timeString);
                                            if (lastHoveredCell !== timeString) {
                                                onCellHover(currentTime);
                                                lastHoveredCell = timeString;
                                            }
                                        } catch (error) {
                                            console.error("Invalid date string:", timeString, error);
                                        }
                                    }
                                }
                            }}
                        >
                            {/* Display time labels within the cell */}
                            <span className={`time-label ${isHourStart ? 'hour-label' : ''}`}>
                                {isHourStart ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                                    `:${minute}`}
                            </span>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default DayView;