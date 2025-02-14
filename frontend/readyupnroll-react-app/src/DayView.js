// DayView.js
import React, { useState, useEffect } from 'react';
import './DayView.css';
import moment from 'moment-timezone';
import tzLookup from 'tz-lookup';

function DayView({ currentDate, availability, onCellClick, onCellHover, isPainting, startPainting, onMouseLeave, selectedTimeZone }) {
    const [isNarrow, setIsNarrow] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsNarrow(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call immediately
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const generateTimeSlots = () => {
        let slots = [];
        const startDate = moment(currentDate).tz(selectedTimeZone); //Use moment-timezone here.
        startDate.startOf('day'); //Sets to the start of the day, in the selected timezone.

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
        // Convert the moment object to a standard Date object for comparison
        const dateString = time.format('YYYY-MM-DD');
        const timeString = time.format('HH:mm');
        return availability[dateString] && availability[dateString].includes(timeString);
    };

     const getTimeOfDayColor = (time, isSelected) => {
        //Get the lat and long of the timezone.
        let latitude, longitude;
        try{
            latitude = tzLookup(selectedTimeZone);
            longitude = tzLookup(selectedTimeZone, true); // Get longitude
        } catch (error){
            console.error("TZ Lookup Error:", error);
            latitude = 0; //Default
            longitude = 0;
        }


        const dateStr = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        let sunrise, sunset;
        //Async fetch
        (async () => {try {

                const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${dateStr}&formatted=0`);
                const data = await response.json();

                if (data.status === 'OK') {
                    const sunriseTime = new Date(data.results.sunrise);
                    const sunsetTime = new Date(data.results.sunset);
                    //Convert to total minutes.
                    sunrise = sunriseTime.getHours() * 60 + sunriseTime.getMinutes();
                    sunset = sunsetTime.getHours() * 60 + sunsetTime.getMinutes();


                } else {
                    console.error('Failed to fetch sunrise/sunset data.');
                    //Defaults:
                    sunrise = 6*60;
                    sunset = 18*60;
                }
            } catch (error) {
                console.error("Error fetching sunrise/sunset:", error);
                //Defaults:
                sunrise = 6*60;
                sunset = 18*60;

            }})();
        if(!sunrise){ //If the values are not ready yet, just show a neutral color.
            return isSelected? '#aaaaaa' : '#dddddd';
        }
        const hour = time.hour(); // Use .hour() from moment-timezone
        const minute = time.minute(); // Use .minute() from moment-timezone
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
        //Get the lat and long of the timezone.
        let latitude, longitude;
        try{
            latitude = tzLookup(selectedTimeZone);
            longitude = tzLookup(selectedTimeZone, true); // Get longitude
        } catch (error){
            console.error("TZ Lookup Error:", error);
            latitude = 0; //Default
            longitude = 0;
        }


        const dateStr = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        let sunrise, sunset;
        //Async fetch
        (async () => {try {

                const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${dateStr}&formatted=0`);
                const data = await response.json();

                if (data.status === 'OK') {
                    const sunriseTime = new Date(data.results.sunrise);
                    const sunsetTime = new Date(data.results.sunset);
                    //Convert to total minutes.
                    sunrise = sunriseTime.getHours() * 60 + sunriseTime.getMinutes();
                    sunset = sunsetTime.getHours() * 60 + sunsetTime.getMinutes();


                } else {
                    console.error('Failed to fetch sunrise/sunset data.');
                    //Defaults:
                    sunrise = 6*60;
                    sunset = 18*60;
                }
            } catch (error) {
                console.error("Error fetching sunrise/sunset:", error);
                //Defaults:
                sunrise = 6*60;
                sunset = 18*60;

            }})();
        if(!sunrise){ //If the values are not ready yet, just show a neutral color.
            return 'black';
        }

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
            >

                {timeSlots.map((time) => {
                    const hour = time.hour();
                    const minute = time.minute();
                    const isHourStart = minute === 0;
                    const isPM = hour >= 12;
                    const isSelected = isCellSelected(time);
                    const timeString = time.toISOString();

                    const isAmPmBorder = (hour === 11 && minute === 45) || (hour === 12 && minute === 0);

                    return (
                        <div
                            key={timeString}
                            className={`calendar-cell ${isSelected ? 'selected' : ''} ${isHourStart ? 'hour-start' : ''} ${isAmPmBorder ? 'am-pm-border' : ''}`}
                            onMouseDown={() => { startPainting(); onCellClick(time); }}
                            onMouseEnter={() => onCellHover(time)}
                            onTouchStart={() => { startPainting(); onCellClick(time); }}
                            onTouchMove={(e) => {
                                e.preventDefault();
                                const touch = e.touches[0];
                                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                                if (element && element.classList.contains('calendar-cell')) {
                                    //Use the data-time.
                                    const timeString = element.dataset.time;
                                    if (timeString) {
                                        try {
                                            // Convert data-time using moment-timezone
                                            const currentTime = moment.tz(timeString, selectedTimeZone);

                                            if (lastHoveredCell !== timeString) {
                                                onCellHover(currentTime);
                                                lastHoveredCell = timeString;
                                            }
                                        } catch (error) {
                                            console.error("Invalid date string:", timeString, error);
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
                               {/*Use moment-timezone to format.*/}
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