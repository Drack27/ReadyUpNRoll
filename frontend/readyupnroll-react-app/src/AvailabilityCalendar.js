import React, { useState, useEffect, useCallback } from 'react';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import TimeZoneDropdown from './TimeZoneDropdown';
import './AvailabilityCalendar.css';
import throttle from 'lodash.throttle';
import moment from 'moment-timezone';

function AvailabilityCalendar({ initialAvailability, onAvailabilityChange, viewMode, currentDate, setViewMode, handleNext, handlePrevious }) {
    const [availability, setAvailability] = useState(initialAvailability || {});
    const [isPainting, setIsPainting] = useState(false);
    const [paintMode, setPaintMode] = useState(null);
    const [selectedTimeZone, setSelectedTimeZone] = useState(null);
    const [weekStartsOnMonday, setWeekStartsOnMonday] = useState(true);

    const areAvailabilitiesEqual = (prevAvailability, currentAvailability) => {
       if (prevAvailability === currentAvailability) return true;
        if (!prevAvailability || !currentAvailability) return false;
        if (Object.keys(prevAvailability).length !== Object.keys(currentAvailability).length) return false;

        for (const date in prevAvailability) {
            if (!currentAvailability.hasOwnProperty(date)) return false;
            if (prevAvailability[date] && !currentAvailability[date]) return false;
            if (!prevAvailability[date] && currentAvailability[date]) return false;
            if (prevAvailability[date] && currentAvailability[date] && prevAvailability[date].length !== currentAvailability[date].length) return false;

            // Sort both arrays before comparing
            const prevSorted = [...prevAvailability[date]].sort();
            const currentSorted = [...currentAvailability[date]].sort();

            for (let i = 0; i < prevSorted.length; i++) {
                if (prevSorted[i] !== currentSorted[i]) return false;
            }
        }
        return true;
    };

    useEffect(() => {
        if (!areAvailabilitiesEqual(availability, initialAvailability)) {
            setAvailability(initialAvailability || {});
        }
    }, [initialAvailability, availability]);

    useEffect(() => {
        onAvailabilityChange(availability);
    }, [availability, onAvailabilityChange]);

    const handleCellClick = (time) => {
        const dateString = moment(time).clone().tz(selectedTimeZone).format('YYYY-MM-DD'); // Wrap with moment
        console.log("Clicked Cell:", dateString);

        setAvailability(prevAvailability => {
            const newAvailability = { ...prevAvailability };
            const fullDay = [];
            for (let i = 0; i < 24; i++) {
                for (let j = 0; j < 60; j+= 60) {
                const hour = i.toString().padStart(2, '0');
                const minute = j.toString().padStart(2,'0');
                fullDay.push(`${hour}:${minute}`);
                }
            }

            if (newAvailability[dateString]) {
                 // Check if it's a full day.  If so, remove it.  If not, make it a full day.
                const isFullDay = fullDay.every(timeSlot => newAvailability[dateString].includes(timeSlot));
                if(isFullDay) {
                    delete newAvailability[dateString];
                } else {
                    newAvailability[dateString] = fullDay;
                }

            } else {
                newAvailability[dateString] = fullDay;
            }
            return newAvailability;
        });
    };


    const handleCellHover = useCallback(
        throttle((time) => {
            if (!isPainting) return;

            const dateString = moment(time).clone().tz(selectedTimeZone).format('YYYY-MM-DD');            console.log("Hovered Cell (while painting):", dateString);

            setAvailability(prevAvailability => {
                const newAvailability = { ...prevAvailability };
                const fullDay = [];
                for (let i = 0; i < 24; i++) {
                   for (let j = 0; j < 60; j+= 60) {
                        const hour = i.toString().padStart(2, '0');
                        const minute = j.toString().padStart(2,'0');
                        fullDay.push(`${hour}:${minute}`);
                    }
                }


                if (paintMode === true) {
                    //Add full day if not there.
                    if(!newAvailability[dateString]) {
                        newAvailability[dateString] = fullDay;
                    }

                } else if (paintMode === false) {
                    //Remove if there.
                    if (newAvailability[dateString]) {
                        delete newAvailability[dateString];
                    }
                }
                return newAvailability;
            });
        }, 16, { trailing: true }),
        [isPainting, paintMode, selectedTimeZone]
    );

    const startPainting = (time) => {
        setIsPainting(true);
        const dateString = moment(time).clone().tz(selectedTimeZone).format('YYYY-MM-DD'); //Wrap with moment!

       // Determine paintMode based on whether the cell is ALREADY fully selected
        setPaintMode(prevPaintMode => {
			const fullDay = [];
            for (let i = 0; i < 24; i++) {
               for (let j = 0; j < 60; j+= 60) {
                    const hour = i.toString().padStart(2, '0');
                    const minute = j.toString().padStart(2,'0');
                    fullDay.push(`${hour}:${minute}`);
                }
            }
            const alreadyFullySelected = availability[dateString] && fullDay.every(timeslot => availability[dateString].includes(timeslot))
            return !alreadyFullySelected;
        });
    };

    const stopPainting = () => {
        setIsPainting(false);
        setPaintMode(null);
    };

    useEffect(() => {
      //... (same as before)
      const handleMouseUp = () => {
            stopPainting();
        };
        const handleTouchEnd = () => {
            stopPainting();
        }

        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    const handleTimeZoneChange = (timeZone) => {
        setSelectedTimeZone(timeZone);
    };

    const handleWeekStartToggle = useCallback(() => {
        setWeekStartsOnMonday(prev => !prev);
    }, []);

    return (
        // ... (rest of the component, no changes) ...
        <div className={`availability-calendar-container ${viewMode === 'week' ? 'week-view-active' : ''}`}>
            <div className="calendar-controls">
                <button onClick={handlePrevious}>&lt; Previous</button>
                <button onClick={() => setViewMode('day')}>Day</button>
                <button onClick={() => setViewMode('week')}>Week</button>
                <button onClick={() => setViewMode('month')}>Month</button>
                <button onClick={() => setViewMode('year')}>Year</button>
                <button onClick={handleNext}>Next &gt;</button>
                <TimeZoneDropdown
                    onTimeZoneChange={handleTimeZoneChange}
                    selectedTimeZone={selectedTimeZone}
                />
            </div>
            {selectedTimeZone ? (
                <>
                    {viewMode === 'day' && (
                        <DayView
                            currentDate={currentDate}
                            availability={availability}
                            onCellClick={handleCellClick}
                            onCellHover={handleCellHover}
                            isPainting={isPainting}
                            startPainting={startPainting}
                            onMouseLeave={stopPainting}
                            selectedTimeZone={selectedTimeZone}
                            weekStartsOnMonday={weekStartsOnMonday}
                            onWeekStartToggle={handleWeekStartToggle}
                        />
                    )}
                    {viewMode === 'week' && (
                        <WeekView
                            currentDate={currentDate}
                            availability={availability}
                            onCellClick={handleCellClick}
                            onCellHover={handleCellHover}
                            isPainting={isPainting}
                            startPainting={startPainting}
                            onMouseLeave={stopPainting}
                            selectedTimeZone={selectedTimeZone}
                            weekStartsOnMonday={weekStartsOnMonday}
                            onWeekStartToggle={handleWeekStartToggle}
                        />
                    )}
                    {viewMode === 'month' && (
                        <MonthView
                            currentDate={currentDate}
                            availability={availability}
                            onCellClick={handleCellClick}
                            onCellHover={handleCellHover}
                            isPainting={isPainting}
                            startPainting={startPainting}
                            onMouseLeave={stopPainting}
                            selectedTimeZone={selectedTimeZone}
                            weekStartsOnMonday={weekStartsOnMonday}
                            onWeekStartToggle={handleWeekStartToggle}
                        />
                    )}
                    {viewMode === 'year' && (
                    <YearView
                        currentDate={currentDate}
                        availability={availability}
                        onCellClick={handleCellClick}
                        onCellHover={handleCellHover} // ADD THIS LINE
                        selectedTimeZone={selectedTimeZone}
                        isPainting={isPainting} //Need to pass these for painting
                        startPainting={startPainting}
                        onMouseLeave={stopPainting}

                    />
                )}
                </>

            ) : (
                <div className="timezone-message">Please select a time zone to view the calendar.</div>
            )}
        </div>
    );
}

export default AvailabilityCalendar;