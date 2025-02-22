// WeekView.js
import React, { useState, useRef, useCallback } from 'react';
import './WeekView.css';
import moment from 'moment-timezone';
import throttle from 'lodash.throttle';

function WeekView({ currentDate, availability, onCellClick, onCellHover, isPainting, startPainting, onMouseLeave, selectedTimeZone }) {
    const calendarRef = useRef(null);
    const [weekStartsOnMonday, setWeekStartsOnMonday] = useState(true);
    let lastHoveredCell = null;

    const handleWeekStartToggle = () => {
        setWeekStartsOnMonday(prev => !prev);
    };

    const generateTimeSlots = useCallback(() => {
        if (!selectedTimeZone) {
            return [];
        }
        let slots = [];
        const startOfWeek = moment(currentDate).tz(selectedTimeZone).startOf(weekStartsOnMonday ? 'isoWeek' : 'week');

        for (let day = 0; day < 7; day++) {
            const dayStart = startOfWeek.clone().add(day, 'days');
            for (let hour = 0; hour < 24; hour++) {
                const time = dayStart.clone().add(hour, 'hours');
                slots.push(time);
            }
        }
        return slots;
    }, [currentDate, selectedTimeZone, weekStartsOnMonday]);

    const timeSlots = generateTimeSlots();

    const isCellSelected = (time) => {
        const dateString = time.clone().tz(selectedTimeZone).format('YYYY-MM-DD');
        const timeString = time.clone().tz(selectedTimeZone).format('HH:mm');
        return availability[dateString] && availability[dateString].includes(timeString);
    };

    const handleMouseMove = useCallback(throttle((e) => {
        e.preventDefault();
        if (!isPainting) return;

        const rect = calendarRef.current.getBoundingClientRect();
        const element = document.elementFromPoint(e.clientX, e.clientY);

        if (element && element.classList.contains('calendar-cell')) {
            const timeString = element.dataset.time;
            if (timeString) {
                try {
                    const currentTime = moment(timeString, moment.ISO_8601).tz(selectedTimeZone);
                    if (lastHoveredCell !== currentTime) {
                        onCellHover(currentTime);
                        lastHoveredCell = currentTime;
                    }
                } catch (error) {
                    console.error("Invalid date string in onMouseMove:", timeString, error);
                }
            }
        }
    }, 16), [isPainting, onCellHover, selectedTimeZone]);

    const handleTouchMove = useCallback(throttle((e) => {
        e.preventDefault();
        if (!isPainting) return;

        const touch = e.touches[0];
        const rect = calendarRef.current.getBoundingClientRect();
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        if (element && element.classList.contains('calendar-cell')) {
            const timeString = element.dataset.time;
            if (timeString) {
                try {
                    const currentTime = moment(timeString, moment.ISO_8601).tz(selectedTimeZone);
                    if (lastHoveredCell !== currentTime) {
                        onCellHover(currentTime);
                        lastHoveredCell = currentTime;
                    }
                } catch (error) {
                    console.error("Invalid date string in handleTouchMove", timeString, error);
                }
            }
        }
    }, 16), [isPainting, onCellHover, selectedTimeZone]);

    const daysOfWeek = weekStartsOnMonday
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const startDate = moment(currentDate).tz(selectedTimeZone).startOf(weekStartsOnMonday ? 'isoWeek' : 'week');

    return (
        <>
            <h3>{moment(currentDate).tz(selectedTimeZone).format('MMMM')}</h3>
            <div className="week-start-toggle">
                <label>
                    Week starts on Monday:
                    <input
                        type="checkbox"
                        checked={weekStartsOnMonday}
                        onChange={handleWeekStartToggle}
                    />
                </label>
                {!weekStartsOnMonday && <span className="disgust-message">You disgust me.</span>}
            </div>
            <div
                className="availability-calendar week-view"
                onMouseLeave={onMouseLeave}
                ref={calendarRef}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
            >
                {/* Day Labels */}
                {daysOfWeek.map((day, index) => {
                    const date = moment(startDate).tz(selectedTimeZone).add(index, 'days');
                    return (
                        <div key={`day-label-${index}`} className="day-label">
                            <div>{day}</div>
                            <div>{date.format('D')}</div>
                        </div>
                    );
                })}

                {/* Time Slots - Corrected Grid Placement */}
                {timeSlots.map((time) => {
                    const isSelected = isCellSelected(time);
                    const dayIndex = time.day();
                    const hourIndex = time.hour();

                    // Correctly calculate the adjusted day index
                    const adjustedDayIndex = weekStartsOnMonday ? (dayIndex + 6) % 7 : dayIndex;

                    return (
                        <div
                            key={time.toISOString()}
                            className={`calendar-cell ${isSelected ? 'selected' : ''}`}
                            onMouseDown={() => { startPainting(); onCellClick(time); }}
                            onMouseEnter={() => onCellHover(time)}
                            onTouchStart={() => { startPainting(); onCellClick(time); }}
                            data-time={time.format()}
                            style={{
                                gridColumn: adjustedDayIndex + 1,  // Correct column
                                gridRow: hourIndex + 2,       // Correct row (offset by 1 for the header)
                            }}
                        >
                            {time.format('ha')}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default WeekView;