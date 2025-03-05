// YearView.js
import React from 'react';
import './YearView.css';

function YearView({ currentDate, availability, onCellClick, onCellHover, isPainting, startPainting, onMouseLeave }) {

    const generateTimeSlots = () => {
        const startDate = new Date(currentDate);
        startDate.setMonth(0, 1);  //Start of current year
        let slots = [];
        for (let i = 0; i < 365; i++) {
          const time = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            slots.push(time);
        }
        return slots;
    }
    const timeSlots = generateTimeSlots();

    const isCellSelected = (time) => {
        const dateString = time.toISOString().split('T')[0];
        const timeString = time.toISOString().split('T')[1].substring(0, 5); // Should be empty for year view
        return availability[dateString] && availability[dateString].includes(timeString);
    };

    const startDate = new Date(currentDate);
    const year = startDate.getFullYear(); // Get the year
    startDate.setMonth(0, 1); // Start of the year
    const months = Array.from({ length: 12 }, (_, i) => i); // 0-11

    return (
        <>
            <h3>{year}</h3>
            <div className="availability-calendar year-view" onMouseLeave={onMouseLeave}>
                {months.map(month => {
                    const monthStartDate = new Date(year, month, 1);
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const monthName = monthStartDate.toLocaleDateString(undefined, { month: 'long' });
                    const startDayOfWeek = monthStartDate.getDay();

                    const monthGrid = [];
                    for (let i = 0; i < startDayOfWeek; i++) {
                        monthGrid.push({ type: 'empty' });
                    }
                    for (let i = 1; i <= daysInMonth; i++) {
                        monthGrid.push({ type: 'day', date: i, month: month });
                    }
                    const totalCells = monthGrid.length;
                    const remainingCells = 7 - (totalCells % 7);
                    if (remainingCells < 7) {
                        for (let i = 0; i < remainingCells; i++) {
                            monthGrid.push({ type: 'empty' });
                        }
                    }

                    return (
                        <div key={`${year}-${month}`} className="year-month-block">
                            <h4>{monthName}</h4>
                            <div className='month-grid'>
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                    <div key={`day-label-${index}`} className="day-label">{day}</div>
                                ))}
                                {monthGrid.map((cell, index) => {
                                    if (cell.type === 'empty') {
                                        return <div key={`empty-${index}`} className="empty-cell"></div>;
                                    } else {
                                        const time = new Date(year, cell.month, cell.date); // Month is 0-indexed
                                        return (
                                            <div
                                                    key={`<span class="math-inline">\{year\}\-</span>{cell.month}-${cell.date}`}
                                                    className={`calendar-cell ${isCellSelected(time) ? 'selected' : ''}`}
                                                    onMouseDown={() => { startPainting(time); onCellClick(time); }}  // Pass 'time' here
                                                    onMouseEnter={() => onCellHover(time)}
                                                    onTouchStart={() => { startPainting(time); onCellClick(time); }} // Pass 'time' here
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
                                                                console.error("Invalid date string", timeString, error);
                                                            }
                                                        }
                                                    }
                                                }}
                                            >
                                                {cell.date}
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default YearView;