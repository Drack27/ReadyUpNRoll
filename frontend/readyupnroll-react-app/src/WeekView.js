// WeekView.js
import React from 'react';
import './WeekView.css';

function WeekView({ currentDate, availability, onCellClick, onCellHover, isPainting, startPainting, onMouseLeave }) {

    const generateTimeSlots = () => {
        let slots = [];
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - currentDate.getDay()); // Start of current week (Sunday)
        for (let i = 0; i < 7 * 24; i++) { // Hour-by-hour
            const time = new Date(startDate.getTime() + i * 60 * 60 * 1000);
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

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the week
    const monthYear = startDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

    return (
        <>
            <h3>{monthYear}</h3>
            <div className="availability-calendar week-view" onMouseLeave={onMouseLeave}>
                {/* Day labels */}
                {daysOfWeek.map((day, index) => (
                    <div key={`day-label-${index}`} className="day-label">{day}</div>
                ))}

                {/* Date Labels */}
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + dayIndex);
                    return (
                        <div key={`date-label-${dayIndex}`} className="date-label">
                            {date.toLocaleDateString(undefined, { day: 'numeric' })}
                        </div>
                    );
                })}

                {/* Time slots */}
                {timeSlots.map((time) => {
                    return (
                        <div
                            key={time.toISOString()}
                            className={`calendar-cell ${isCellSelected(time) ? 'selected' : ''}`}
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
                    )
                })}
            </div>
        </>
    );
}

export default WeekView;