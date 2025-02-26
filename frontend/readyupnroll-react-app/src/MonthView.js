// MonthView.js
import React, { useState, useCallback } from 'react';
import './MonthView.css';
import moment from 'moment-timezone';

function MonthView({ currentDate, availability, onCellClick, onCellHover, isPainting, startPainting, onMouseLeave, selectedTimeZone, weekStartsOnMonday, onWeekStartToggle}) {

    const handleWeekStartToggle = () => {
      onWeekStartToggle(); //call handler from parent component.
    }
    const generateTimeSlots = useCallback(() => {
        if (!selectedTimeZone) {
            return [];
        }
        const startDate = moment(currentDate).tz(selectedTimeZone).startOf('month');
        const daysInMonth = startDate.daysInMonth();
        let slots = [];

        for (let i = 0; i < daysInMonth; i++) {
            const day = startDate.clone().add(i, 'days');
            for (let j = 0; j < 4; j++) { // Four 6-hour slots per day
                const time = day.clone().add(j * 6, 'hours');
                slots.push(time);
            }
        }
        return slots;
    }, [currentDate, selectedTimeZone]); // Add selectedTimeZone to dependency array

    const timeSlots = generateTimeSlots();
const isCellSelected = (time) => {
    if (!selectedTimeZone) {
        return false; // Or handle appropriately if no timezone
    }
    const dateString = time.clone().tz(selectedTimeZone).format('YYYY-MM-DD');
    const timeString = time.clone().tz(selectedTimeZone).format('HH:mm');
    return availability[dateString] && availability[dateString].includes(timeString);
};

    const startDate = moment(currentDate).tz(selectedTimeZone).startOf('month');
    const daysInMonth = startDate.daysInMonth();
    const startDayOfWeek = startDate.clone().startOf(weekStartsOnMonday ? 'isoWeek' : 'week').day(); // Get the starting day *of the week*, adjusted
    const monthName = startDate.format('MMMM YYYY');

    const timeOfDayLabels = ['Morning', 'Afternoon', 'Evening', 'Night'];
    const timeOfDayIcons = ['☀️', '🌤️', '🌅', '🌙']; // Example icons
    const timeOfDayColors = ['#FFECB3', '#BBDEFB', '#FFCC80', '#B39DDB']; // Example colors

    const daysOfWeek = weekStartsOnMonday
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
       // Create an array representing the entire month grid, including empty cells for previous/next month days

    const monthGrid = [];
    //Empty cells. Now, adjusted for week start.
    for (let i = 0; i < startDayOfWeek; i++) {
        monthGrid.push({ type: 'empty' });
    }
    //Day cells
    for (let i = 1; i <= daysInMonth; i++) {
        monthGrid.push({ type: 'day', date: i });
    }
    // Fill in empty cells to complete the last week
    const totalCells = monthGrid.length;
    const remainingCells = (7 * 6) - totalCells; //For a 7X6 grid
    if (remainingCells < (7*6)) {
        for (let i = 0; i < remainingCells; i++) {
            monthGrid.push({ type: 'empty' });
        }
    }

    return (
        <>
            <h3>{monthName}</h3>
            <div className="week-start-toggle">
                <label>
                    Week starts on Monday:
                    <input
                        type="checkbox"
                        checked={weekStartsOnMonday}
                        onChange={handleWeekStartToggle}
                    />
                </label>
            </div>
            <div className="availability-calendar month-view" onMouseLeave={onMouseLeave}>
                {/* Days of the week labels */}
                {daysOfWeek.map((day, index) => (
                    <div key={`day-label-${index}`} className="day-label">
                        {day}
                    </div>
                ))}

                {/* Render the month grid */}
                {monthGrid.map((cell, index) => {
                    if (cell.type === 'empty') {
                        return <div key={`empty-${index}`} className="empty-cell"></div>;
                    } else {
                        const day = startDate.clone().add(cell.date -1, 'days');

                        return (
                            <div key={`day-${cell.date}`} className="day-cell">
                                <div className="date-label">{cell.date}</div>
                                <div className="time-of-day-grid">
                                    {timeOfDayLabels.map((label, labelIndex) => {
                                        const time = day.clone().add(labelIndex * 6, 'hours');
                                        const isSelected = isCellSelected(time);
                                        return (
                                            <div
                                                key={`${cell.date}-${label}`}
                                                className={`calendar-cell time-of-day-cell ${isSelected ? 'selected' : ''}`}
                                                onMouseDown={() => { startPainting(); onCellClick(time); }}
                                                onMouseEnter={() => onCellHover(time)}
                                                onTouchStart={() => { startPainting(); onCellClick(time); }}
                                                style={{ backgroundColor: timeOfDayColors[labelIndex] }}
                                            >
                                                <span className="time-of-day-icon">{timeOfDayIcons[labelIndex]}</span>
                                                {/*<span className="time-of-day-label">{label}</span> Removed labels for now */}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </>
    );
}

export default MonthView;