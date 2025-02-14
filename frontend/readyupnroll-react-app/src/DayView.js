// DayView.js
import React, { useState, useEffect } from 'react';
import './DayView.css';

function DayView({ currentDate, availability, onCellClick, onCellHover, isPainting, startPainting, onMouseLeave }) {
    const [isNarrow, setIsNarrow] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsNarrow(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call immediately
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const generateTimeSlots = () => {
        let slots = [];
        const startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0);
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 4; j++) {
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

    const getTimeOfDayColor = (time, isSelected) => {
        const hour = time.getHours();
        const minute = time.getMinutes();
        const totalMinutes = hour * 60 + minute;

        let h, s, l;

        // Sunrise/Sunset times (generalized)
        const sunrise = 6 * 60;  // 6:00 AM
        const sunset = 18 * 60; // 6:00 PM

        if (totalMinutes < sunrise) {
            // Night (12:00 AM - 6:00 AM)
            h = 240; // Blue hue
            s = 100;
            l = isSelected ? 30 : 10;  // Lighter if selected
        } else if (totalMinutes < sunrise + 60) {
            // Sunrise (6:00 AM - 7:00 AM) - Gradient
            const progress = (totalMinutes - sunrise) / 60;
            h = 240 + (progress * (60 - 240));  // Blue to Orange
            s = 100;
            l = isSelected ? 30 + (progress * 20) : 10 + (progress * 15); // Increase lightness
        } else if (totalMinutes < sunset) {
            // Day (7:00 AM - 6:00 PM)
            h = 60;  // Yellow hue
            s = 100;
            l = isSelected ? 50 : 25; // Lighter if selected
        } else if (totalMinutes < sunset + 60) {
            // Sunset (6:00 PM - 7:00 PM) - Gradient
            const progress = (totalMinutes - sunset) / 60;
            h = 60 - (progress * (60 - 240)); // Orange to Blue
            s = 100;
            l = isSelected ? 50 - (progress * 20) : 25 - (progress * 15);  // Decrease lightness
        } else {
            // Night (7:00 PM - 12:00 AM)
            h = 240; // Blue hue
            s = 100;
            l = isSelected ? 30 : 10; // Lighter if selected
        }

        return `hsl(${h}, ${s}%, ${l}%)`;
    };
    const getTextColor = (time) => {
        const hour = time.getHours();
        const minute = time.getMinutes();
        const totalMinutes = hour * 60 + minute;

        // Sunrise/Sunset times (generalized)
        const sunrise = 6 * 60;  // 6:00 AM
        const sunset = 18 * 60; // 6:00 PM

        // Use a similar logic as getTimeOfDayColor, but just return black or white.
        if (totalMinutes < sunrise || totalMinutes >= sunset) {
            return 'white'; // White text during night/sunrise/sunset.
        }
        return 'black';
    }

    let lastHoveredCell = null;

    return (
        <>
            <h3 className="day-view-heading">{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            <div
                className={`availability-calendar day-view ${isNarrow ? 'narrow-view' : 'wide-view'}`}
                onMouseLeave={onMouseLeave}
            >
                {timeSlots.map((time) => {
                    const hour = time.getHours();
                    const minute = time.getMinutes();
                    const isHourStart = minute === 0;
                    const isPM = hour >= 12;
                    const isSelected = isCellSelected(time);
                    const timeString = time.toISOString();

                    // Determine if this cell is on the AM/PM border
                    const isAmPmBorder = (hour === 11 && minute === 45) || (hour === 12 && minute === 0);

                    return (
                        <div
                            key={timeString}
                            className={`calendar-cell ${isSelected ? 'selected' : ''} ${isHourStart ? 'hour-start' : ''} ${isAmPmBorder ? 'am-pm-border' : ''}`}
                            onMouseDown={() => { startPainting(); onCellClick(time); }}
                            onMouseEnter={() => onCellHover(time)}
                            onTouchStart={() => { startPainting(); onCellClick(time); }}
                            onTouchMove={(e) => {
                                e.preventDefault();
                                const touch = e.touches[0];
                                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                                if (element && element.classList.contains('calendar-cell')) {
                                    const timeString = element.dataset.time;
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
                            data-time={timeString}
                            style={{
                                backgroundColor: getTimeOfDayColor(time, isSelected),
                                color: getTextColor(time)

                            }}
                        >
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