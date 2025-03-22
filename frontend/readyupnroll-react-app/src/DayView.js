import React, { useState, useEffect, useRef, useMemo } from 'react';
import './DayView.css';
import moment from 'moment-timezone';
import SunCalc from 'suncalc';
import getTimeZoneCoordinates from './TimeZoneCoordinates';

function DayView({ currentDate, availability, onCellClick, onCellHover, isPainting, startPainting, stopPainting, selectedTimeZone }) { // Removed onMouseLeave
    console.log("DayView rendering. isPainting:", isPainting);
    const [isNarrow, setIsNarrow] = useState(window.innerWidth <= 768);
    const [sunrise, setSunrise] = useState(6 * 60); // Default: 6 AM
    const [sunset, setSunset] = useState(18 * 60); // Default: 6 PM
    const [timeZoneData, setTimeZoneData] = useState(getTimeZoneCoordinates());
    const calendarRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setIsNarrow(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const updateSunriseSunset = () => {
            if (!selectedTimeZone) {
                return;
            }

            let latitude, longitude;
            try {
                const coords = timeZoneData[selectedTimeZone];
                if (coords) {
                    latitude = coords.latitude;
                    longitude = coords.longitude;
                } else {
                    throw new Error(`Timezone not found in lookup: ${selectedTimeZone}`);
                }
            } catch (err) {
                console.error("Error looking up lat and long: ", err);
                latitude = 0;  // Default values if lookup fails
                longitude = 0;
                return; // Exit
            }

            const year = moment(currentDate).year();
            const month = moment(currentDate).month();
            const day = moment(currentDate).date();
            const date = new Date(Date.UTC(year, month, day, 0, 0, 0));
            const times = SunCalc.getTimes(date, latitude, longitude);
            const sunriseMoment = moment.tz(times.sunrise, selectedTimeZone);
            const sunsetMoment = moment.tz(times.sunset, selectedTimeZone);

            setSunrise(sunriseMoment.hours() * 60 + sunriseMoment.minutes());
            setSunset(sunsetMoment.hours() * 60 + sunsetMoment.minutes());
        };
        updateSunriseSunset();
    }, [selectedTimeZone, currentDate, timeZoneData]);

    const timeSlots = useMemo(() => {
        let slots = [];
        const startDate = moment(currentDate).tz(selectedTimeZone).startOf('day');

        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 4; j++) {
                const time = startDate.clone().add((i * 60) + (j * 15), 'minutes');
                slots.push(time);
            }
        }
        return slots;
    }, [currentDate, selectedTimeZone]);

    const getTimeOfDayColor = (time) => {
        const hour = time.hour();
        const minute = time.minute();
        const totalMinutes = hour * 60 + minute;
        let h, s, l;

        if (totalMinutes < sunrise) {
            h = 240;
            s = 100;
            l = 10;
        } else if (totalMinutes < sunrise + 60) {
            const progress = (totalMinutes - sunrise) / 60;
            h = 240 + (progress * (60 - 240));
            s = 100;
            l = 10 + (progress * 15);
        } else if (totalMinutes < sunset) {
            h = 60;
            s = 100;
            l = 25;
        } else if (totalMinutes < sunset + 60) {
            const progress = (totalMinutes - sunset) / 60;
            h = 60 - (progress * (60 - 240));
            s = 100;
            l = 25 - (progress * 15);
        } else {
            h = 240;
            s = 100;
            l = 10;
        }
        return `hsl(${h}, ${s}%, ${l}%)`;
    };

    const getTextColor = (time) => {
        const hour = time.hour();
        const minute = time.minute();
        const totalMinutes = hour * 60 + minute;

        return (totalMinutes < sunrise || totalMinutes >= sunset) ? 'white' : 'black';
    };
    const dateString = moment(currentDate).tz(selectedTimeZone).format('YYYY-MM-DD'); //Moved for efficiency

    const getCellStyle = (time) => {
        const timeString = time.format('HH:mm');
        const isAvailable = availability[dateString]?.includes(timeString);

        let className = 'calendar-cell';
        let style = {
            backgroundColor: getTimeOfDayColor(time),
            color: getTextColor(time),
        };

        if (isAvailable) {
          className += ' available'; //Always give 'available' class if it is in availability
        }

        return { className, style };
    };


    let lastHoveredCell = null;

    return (
        <>
            <h3 className="day-view-heading">{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            <div
                className={`availability-calendar day-view ${isNarrow ? 'narrow-view' : 'wide-view'}`}
                ref={calendarRef}
                onMouseMove={(e) => {
                    e.preventDefault();
                    if (!isPainting) return;

                    const element = document.elementFromPoint(e.clientX, e.clientY);

                    if (element && element.classList.contains('calendar-cell')) {
                        const timeString = element.dataset.time;
                        if (timeString) {
                            try {
                                const currentTime = moment(timeString, 'YYYY-MM-DDTHH:mm:ss.SSSZ').tz(selectedTimeZone);
                                if (!lastHoveredCell || !lastHoveredCell.isSame(currentTime)) {
                                    onCellHover(currentTime.toDate());
                                    lastHoveredCell = currentTime;
                                }
                            } catch (error) {
                                console.error("Invalid date string in onMouseMove:", timeString, error);
                            }
                        }
                    }
                }}
                onTouchMove={(e) => {
                    e.preventDefault();
                    if (!isPainting) return;

                    const touch = e.touches[0];
                    const element = document.elementFromPoint(touch.clientX, touch.clientY);

                    if (element && element.classList.contains('calendar-cell')) {
                        const timeString = element.dataset.time;
                        if (timeString) {
                            try{
                                const currentTime = moment(timeString, 'YYYY-MM-DDTHH:mm:ss.SSSZ').tz(selectedTimeZone);
                                if (!lastHoveredCell || !lastHoveredCell.isSame(currentTime)) {
                                    onCellHover(currentTime.toDate());
                                    lastHoveredCell = currentTime;
                                }
                            } catch (error) {
                                console.error("Invalid date string in onTouchMove:", timeString, error);
                            }

                        }
                    }
                }}
            >
                {timeSlots.map((time) => {
                    const hour = time.hour();
                    const minute = time.minute();
                    const isHourStart = minute === 0;
                    const timeString = time.toISOString();
                    const isAmPmBorder = (hour === 11 && minute === 45) || (hour === 12 && minute === 0);
                    const { className, style } = getCellStyle(time); // Get combined styles

                    return (
                        <div
                            key={timeString}
                            className={className}
                            onMouseDown={() => { startPainting(time.toDate()); onCellClick(time.toDate()); }}
                            onMouseEnter={() => { onCellHover(time.toDate()) }}
                            onTouchStart={() => { startPainting(time.toDate()); onCellClick(time.toDate()); }}
                            onMouseUp={stopPainting} 
                            onTouchEnd={stopPainting}
                            data-time={timeString}
                            style={style}
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