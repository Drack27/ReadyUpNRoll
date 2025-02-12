// MonthView.js
import React from 'react';
import './MonthView.css';

function MonthView({ currentDate, availability, onCellClick, onCellHover, isPainting, startPainting, onMouseLeave }) {

    const generateTimeSlots = () => {
        const startDate = new Date(currentDate);
        startDate.setDate(1); // Start of the current month
        const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
        let slots = [];
        for (let i = 0; i < daysInMonth; i++) { // Iterate over days
          for (let j = 0; j < 4; j++) { // Four 6-hour slots per day
            const time = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000) + (j * 6 * 60 * 60 * 1000));
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

    const startDate = new Date(currentDate);
    startDate.setDate(1); // Start of the month
    const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
    const startDayOfWeek = startDate.getDay(); // 0 (Sun) to 6 (Sat)
    const monthName = startDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    const timeOfDayLabels = ['Morning', 'Afternoon', 'Evening', 'Night'];

    // Create an array representing the entire month grid, including empty cells for previous/next month days
    const monthGrid = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        monthGrid.push({ type: 'empty' }); // Empty cells before the 1st
    }
    for (let i = 1; i <= daysInMonth; i++) {
        monthGrid.push({ type: 'day', date: i }); // Day cells
    }
    // Fill in empty cells to complete the last week
    const totalCells = monthGrid.length;
    const remainingCells = 7 - (totalCells % 7);
    if (remainingCells < 7) {
        for (let i = 0; i < remainingCells; i++) {
            monthGrid.push({ type: 'empty' });
        }
    }

    return (
        <>
            <h3>{monthName}</h3>
            <div className="availability-calendar month-view" onMouseLeave={onMouseLeave}>
                {/* Days of the week labels */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div key={`day-label-${index}`} className="day-label">{day}</div>
                ))}

                {/* Render the month grid */}
                {monthGrid.map((cell, index) => {
                    if (cell.type === 'empty') {
                        return <div key={`empty-${index}`} className="empty-cell"></div>;
                    } else {
                        const date = new Date(startDate);
                        date.setDate(cell.date); // Set the correct day

                        return (
                            <div key={`day-${cell.date}`} className="day-cell">
                                <div className="date-label">{cell.date}</div>
                                {timeOfDayLabels.map((label, labelIndex) => {
                                    //Create times for each segment
                                    const time = new Date(date);
                                    time.setHours(labelIndex * 6); //0, 6, 12, 18

                                    return (
                                        <div
                                            key={`${cell.date}-${label}`}
                                            className={`calendar-cell time-of-day-cell ${isCellSelected(time) ? 'selected' : ''}`}
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
                                    );
                                })}
                            </div>
                        );
                    }
                })}
            </div>
        </>
    );
}

export default MonthView;