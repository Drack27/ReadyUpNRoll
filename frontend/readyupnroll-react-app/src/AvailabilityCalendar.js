import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar's CSS
import './AvailabilityCalendar.css'; // Import your custom CSS

function AvailabilityCalendar() {
  const [selectedDates, setSelectedDates] = useState(new Set());

  const handleDateChange = (date) => {
    // Toggle date selection
    setSelectedDates((prevDates) => {
      const newDates = new Set(prevDates);
      if (newDates.has(date)) {
        newDates.delete(date);
      } else {
        newDates.add(date);
      }
      return newDates;
    });
  };

  // Custom tile content to highlight selected dates
  const tileContent = ({ date, view }) => {
    if (view === 'month' && selectedDates.has(date)) {
      return <div className="selected-date-tile"></div>;
    }
  };

  return (
    <div className="availability-calendar">
      <Calendar 
        onChange={handleDateChange} 
        value={Array.from(selectedDates)}
        tileContent={tileContent} 
      />
    </div>
  );
}

export default AvailabilityCalendar;