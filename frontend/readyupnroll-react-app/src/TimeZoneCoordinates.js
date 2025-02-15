// TimeZoneCoordinates.js
import moment from 'moment-timezone';

const getTimeZoneCoordinates = () => {
    const timeZoneCoordinates = {}; // Initialize inside the function

    const timeZones = moment.tz.names().filter(tz => !tz.match(/^(Etc|SystemV)/) && tz.includes('/'));

    for (const tz of timeZones) {
        try {
            const zone = moment.tz.zone(tz);
            if (zone && zone.coordinates) { //Simplified if statement
                const [latitude, longitude] = zone.coordinates.split(',').map(Number);
                timeZoneCoordinates[tz] = { latitude, longitude }; // Use tz as the key!
            }

        } catch (error) {
            console.error(`Could not find coordinates for ${tz}`, error); // Improved error handling
        }
    }
    return timeZoneCoordinates; // Return the populated object
}


export default getTimeZoneCoordinates;