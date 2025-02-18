// DayView.js
import React, { useState, useEffect, useRef} from 'react';
import './DayView.css';
import moment from 'moment-timezone';
import SunCalc from 'suncalc';
import getTimeZoneCoordinates from './TimeZoneCoordinates'; // Import the FUNCTION

function DayView({ currentDate, availability, onCellClick, onCellHover, isPainting, startPainting, onMouseLeave, selectedTimeZone }) {
    const [isNarrow, setIsNarrow] = useState(window.innerWidth <= 768);
    const [sunrise, setSunrise] = useState(6 * 60); // Default: 6 AM
    const [sunset, setSunset] = useState(18 * 60); // Default: 6 PM
    const [timeZoneData, setTimeZoneData] = useState(getTimeZoneCoordinates()); // Call the function!
    const calendarRef = useRef(null); // Add a ref to the calendar container

    useEffect(() => {
        const handleResize = () => {
            setIsNarrow(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call immediately
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const updateSunriseSunset = () => {
            if (!selectedTimeZone) {
                return;
            }

            let latitude, longitude;
            try {
                const coords = timeZoneData[selectedTimeZone]; // Use the loaded data
                if (coords) {
                    latitude = coords.latitude;
                    longitude = coords.longitude;
                } else {
                    // This is now a more accurate error message.
                    throw new Error(`Timezone not found in lookup: ${selectedTimeZone}`);
                }
            } catch (err) {
                console.error("Error looking up lat and long: ", err);
                latitude = 0;  // Default values if lookup fails
                longitude = 0;
                return; //Important: exit if we don't have coordinates
            }

            // Get year, month, and day from currentDate (works for both Date and Moment objects).
            const year = moment(currentDate).year();
            const month = moment(currentDate).month(); // Month is 0-indexed (0 = January)
            const day = moment(currentDate).date();

            // Create a UTC Date object, and specifically set hours, minutes, seconds to 0
            const date = new Date(Date.UTC(year, month, day, 0, 0, 0));


            const times = SunCalc.getTimes(date, latitude, longitude);

            // Use moment.tz to *format* the sunrise/sunset times into the selected timezone.
            const sunriseMoment = moment.tz(times.sunrise, selectedTimeZone);
            const sunsetMoment = moment.tz(times.sunset, selectedTimeZone);


            setSunrise(sunriseMoment.hours() * 60 + sunriseMoment.minutes());
            setSunset(sunsetMoment.hours() * 60 + sunsetMoment.minutes());
        };
        updateSunriseSunset();
    }, [selectedTimeZone, currentDate, timeZoneData]); // Add timeZoneData as a dependency

    // ... (rest of your DayView component remains the same) ...

    const generateTimeSlots = () => {
        let slots = [];
        const startDate = moment(currentDate).tz(selectedTimeZone);
        startDate.startOf('day');

        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 4; j++) {
                const time = startDate.clone().add((i * 60) + (j * 15), 'minutes');
                slots.push(time);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const isCellSelected = (time) => {
        const dateString = time.format('YYYY-MM-DD');
        const timeString = time.format('HH:mm');
        return availability[dateString] && availability[dateString].includes(timeString);
    };

    const getTimeOfDayColor = (time, isSelected) => {
        const hour = time.hour();
        const minute = time.minute();
        const totalMinutes = hour * 60 + minute;

        let h, s, l;

        if (totalMinutes < sunrise) {
            h = 240;
            s = 100;
            l = isSelected ? 30 : 10;
        } else if (totalMinutes < sunrise + 60) {
            const progress = (totalMinutes - sunrise) / 60;
            h = 240 + (progress * (60 - 240));
            s = 100;
            l = isSelected ? 30 + (progress * 20) : 10 + (progress * 15);
        } else if (totalMinutes < sunset) {
            h = 60;
            s = 100;
            l = isSelected ? 50 : 25;
        } else if (totalMinutes < sunset + 60) {
            const progress = (totalMinutes - sunset) / 60;
            h = 60 - (progress * (60 - 240));
            s = 100;
            l = isSelected ? 50 - (progress * 20) : 25 - (progress * 15);
        } else {
            h = 240;
            s = 100;
            l = isSelected ? 30 : 10;
        }

        return `hsl(${h}, ${s}%, ${l}%)`;
    };

    const getTextColor = (time) => {
        const hour = time.hour();
        const minute = time.minute();
        const totalMinutes = hour * 60 + minute;

        if (totalMinutes < sunrise || totalMinutes >= sunset) {
            return 'white';
        }
        return 'black';
    };

    let lastHoveredCell = null;

    return (
        <>
            <h3 className="day-view-heading">{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            <div
                className={`availability-calendar day-view ${isNarrow ? 'narrow-view' : 'wide-view'}`}
                onMouseLeave={onMouseLeave}
                ref={calendarRef} // Assign the ref here
            >
                {timeSlots.map((time) => {
                    const hour = time.hour();
                    const minute = time.minute();
                    const isHourStart = minute === 0;
                    const isSelected = isCellSelected(time);
                    const timeString = time.toISOString();
                    const isAmPmBorder = (hour === 11 && minute === 45) || (hour === 12 && minute === 0);

                    return (
                        <div
                        key={timeString}
                        className={`calendar-cell ${isSelected ? 'selected' : ''} ${isHourStart ? 'hour-start' : ''} ${isAmPmBorder ? 'am-pm-border' : ''}`}
                        onMouseDown={() => { startPainting(); onCellClick(time); }}
                        onMouseEnter={() => onCellHover(time)}
                        onMouseMove={(e) => {
                            e.preventDefault();
                            if (!isPainting) return; // Add this check!

                            // Get bounding rectangle of the calendar grid
                            const rect = calendarRef.current.getBoundingClientRect();

                            // Calculate relative coordinates
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;

                            // Get the element at the *relative* coordinates
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
                        }}
                        onTouchStart={() => { startPainting(); onCellClick(time); }}
                        onTouchMove={(e) => {
                            e.preventDefault();
                            if (!isPainting) return; // Add this check!

                            const touch = e.touches[0];
                            const rect = calendarRef.current.getBoundingClientRect(); // Get calendar bounds

                            // Calculate *relative* coordinates
                            const x = touch.clientX - rect.left;
                            const y = touch.clientY - rect.top;

                            // Get element at *relative* coordinates
                            const element = document.elementFromPoint(touch.clientX, touch.clientY);

                            if (element && element.classList.contains('calendar-cell')) {
                                    const timeString = element.dataset.time;
                                    if (timeString) {
                                          try{
                                              const currentTime = moment(timeString, moment.ISO_8601).tz(selectedTimeZone);
                                              if (lastHoveredCell !== currentTime) {
                                                onCellHover(currentTime);
                                                lastHoveredCell = currentTime;
                                            }
                                          } catch (error) {
                                            console.error("Invalid time string:", timeString, error);
                                        }
                                    }
                                }
                        }}
                        data-time={time.format()}
                        style={{
                            backgroundColor: getTimeOfDayColor(time, isSelected),
                            color: getTextColor(time)
                        }}
                    >
                        <span className={`time-label ${isHourStart ? 'hour-label' : ''}`}>
                            {isHourStart ? time.format('LT') : `:${time.format('mm')}`}
                        </span>
                    </div>
                    );
                })}
            </div>
        </>
    );
}

export default DayView;