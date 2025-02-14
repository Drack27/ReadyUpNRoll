// TimeZoneDropdown.js
import React from 'react';
import moment from 'moment-timezone';
import './TimeZoneDropdown.css';

function TimeZoneDropdown({ onTimeZoneChange, selectedTimeZone }) {
    const timeZones = moment.tz.names();

    return (
        <select
            className="timezone-dropdown"
            onChange={(e) => onTimeZoneChange(e.target.value)}
            value={selectedTimeZone || ''} // Use empty string if selectedTimeZone is null
        >
            <option value="" disabled hidden>Hey, what's your time zone?</option>
            {timeZones.map((tz) => (
                <option key={tz} value={tz}>
                    {tz}
                </option>
            ))}
        </select>
    );
}

export default TimeZoneDropdown;