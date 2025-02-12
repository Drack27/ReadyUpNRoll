// DayView.js
import React from 'react';
import './DayView.css';

function DayView({ currentDate, availability, onCellClick, onCellHover, isPainting, startPainting, onMouseLeave }) {

    const generateTimeSlots = () => {
        let slots = [];
        const startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0);
        for (let i = 0; i < 24 * 60; i++) { // Minute-by-minute
            const time = new Date(startDate.getTime() + i * 60 * 1000);
            slots.push(time);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const isCellSelected = (time) => {
        const dateString = time.toISOString().split('T')[0];
        const timeString = time.toISOString().split('T')[1].substring(0, 5);
        return availability[dateString] && availability[dateString].includes(timeString);
    };

    return (
        <>
            <h3>{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            <div className="availability-calendar day-view" onMouseLeave={onMouseLeave}>
                {timeSlots.map((time) => {
                    const hour = time.getHours();
                    const minute = time.getMinutes();
                    const isHourStart = minute === 0;
                    return (
                        <React.Fragment key={time.toISOString()}>
                            {isHourStart && (
                                <div className="hour-label">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            )}
                            <div
                                className={`calendar-cell ${isCellSelected(time) ? 'selected' : ''}`}
                                onMouseDown={() => { startPainting(); onCellClick(time); }}
                                onMouseEnter={() => onCellHover(time)}
                                onTouchStart={() => { startPainting(); onCellClick(time); }}
                                onTouchMove={(e) => {
                                    e.preventDefault();
                                    const touch = e.touches[0];
                                    const element = document.elementFromPoint(touch.clientX, touch.clientY);
                                    if (element && element.classList.contains('calendar-cell')) {
                                        const timeString = element.getAttribute('key'); // Get the key attribute
                                        if (timeString) {
                                            try {
                                                const time = new Date(timeString);
                                                onCellHover(time);
                                            } catch (error) {
                                                console.error("Invalid date string:", timeString, error);
                                            }
                                        }
                                    }
                                }}
                            >
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </>
    );
}

export default DayView;