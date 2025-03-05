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
    }, [currentDate, selectedTimeZone]);

    const timeSlots = generateTimeSlots();
    const isCellSelected = (time) => {
        if (!selectedTimeZone) {
            return false;
        }
        const dateString = time.clone().tz(selectedTimeZone).format('YYYY-MM-DD');
        const timeString = time.clone().tz(selectedTimeZone).format('HH:mm');
        return availability[dateString] && availability[dateString].includes(timeString);
    };

    const startDate = moment(currentDate).tz(selectedTimeZone).startOf('month');
    const daysInMonth = startDate.daysInMonth();
    // CORRECT: Get the day of the week (0-6, Sun-Sat or Mon-Sun)
    const startDayOfWeek = startDate.clone().day();

    //Adjust the Start Day of Week, now that we have the *actual* start.
    const adjustedStartDayOfWeek = weekStartsOnMonday
      ? (startDayOfWeek + 6) % 7 //If starts on Monday, transforms 0->6, 1->0, 2->1, ...
      : startDayOfWeek; //If starts on Sunday, no change is needed

    const monthName = startDate.format('MMMM YYYY');

    const timeOfDayLabels = ['Morning', 'Afternoon', 'Evening', 'Night'];
    const timeOfDayIcons = ['🐔', '☀️', '🌅', '🌙'];
    const timeOfDayColors = ['#FFECB3', '#BBDEFB', '#FFCC80', '#B39DDB'];

    const daysOfWeek = weekStartsOnMonday
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


    const monthGrid = [];
    // Add empty cells for days before the first of the month
    for (let i = 0; i < adjustedStartDayOfWeek; i++) {
        monthGrid.push({ type: 'empty' });
    }

    // Add day cells for the current month
    for (let i = 1; i <= daysInMonth; i++) {
        monthGrid.push({ type: 'day', date: i });
    }

    // Fill in any remaining cells to complete the last week
    const totalCells = monthGrid.length;
    const remainingCells = (7 * 6) - totalCells; //For a 7x6 grid
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
                        const day = startDate.clone().add(cell.date - 1, 'days');

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