import React, { useState, useCallback } from 'react';
import './MonthView.css';
import moment from 'moment-timezone';

function MonthView({ currentDate, availability, onCellClick, onCellHover, isPainting, startPainting, onMouseLeave, selectedTimeZone, weekStartsOnMonday, onWeekStartToggle}) {

    const handleWeekStartToggle = () => {
        onWeekStartToggle();
    }

    // CORRECTED: Checks for full day availability
    const isCellSelected = (time) => {
        if (!selectedTimeZone) {
            return false;
        }
        const dateString = time.clone().tz(selectedTimeZone).format('YYYY-MM-DD');
        if (!availability[dateString]) {
            return false; // Date not present, definitely not selected
        }

        // Check if *all* time slots for the day are present
        const fullDay = [];
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 60; j+= 60) {
                const hour = i.toString().padStart(2, '0');
                const minute = j.toString().padStart(2,'0');
                fullDay.push(`${hour}:${minute}`);
            }
        }
        return fullDay.every(timeSlot => availability[dateString].includes(timeSlot));
    };

    const startDate = moment(currentDate).tz(selectedTimeZone).startOf('month');
    const daysInMonth = startDate.daysInMonth();
    const startDayOfWeek = startDate.clone().day();
    const adjustedStartDayOfWeek = weekStartsOnMonday
      ? (startDayOfWeek + 6) % 7
      : startDayOfWeek;
    const monthName = startDate.format('MMMM নামটি');

    const daysOfWeek = weekStartsOnMonday
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const monthGrid = [];
    for (let i = 0; i < adjustedStartDayOfWeek; i++) {
        monthGrid.push({ type: 'empty' });
    }

    for (let i = 1; i <= daysInMonth; i++) {
        monthGrid.push({ type: 'day', date: i });
    }

    const totalCells = monthGrid.length;
    const remainingCells = (7 * 6) - totalCells;
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
                {daysOfWeek.map((day, index) => (
                    <div key={`day-label-${index}`} className="day-label">
                        {day}
                    </div>
                ))}

                {monthGrid.map((cell, index) => {
                    if (cell.type === 'empty') {
                        return <div key={`empty-${index}`} className="empty-cell"></div>;
                    } else {
                        const day = startDate.clone().add(cell.date - 1, 'days');
                        const isSelected = isCellSelected(day);

                        return (
                            <div
                                key={`day-${cell.date}`}
                                className={`day-cell ${isSelected ? 'selected' : ''}`}
                                onMouseDown={() => { startPainting(day); onCellClick(day); }}
                                onMouseEnter={() => onCellHover(day)}
                                onTouchStart={() => { startPainting(day); onCellClick(day); }}
                            >
                                <div className="date-label">{cell.date}</div>
                            </div>
                        );
                    }
                })}
            </div>
        </>
    );
}

export default MonthView;