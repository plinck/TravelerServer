/*
 * Dark Sky Weather API
 * This means that you're converting UNIX timestamps to local times incorrectly.
 * For each UNIX timestamp, there is a corresponding local time for each and every different timezone.
 *  For example, the UNIX time 1466892000 corresponds to 6PM (18:00) in New York, 10PM (22:00) GMT,
 *  and midnight (00:00) of the following day in Amsterdam. When converting UNIX 
 * timestamps to local times, always use the timezone property of the API response,
 *  so that your software knows which timezone is the right one.
 * ====================================================================================================
 */
"use strict";
/* jshint node: true */

const https = require('https');

// Current Weather Object Class - just to show what is being passed
const currentWeatherClass = {
    day: 0, // need to find date format and convert
    timeZone: 0, // need to find date format and convert
    currentTemp: 0.0,
    feelsLike: 0.0,
    humidity: 0.0, // %
    chanceOfRain: 0.0, //%
    wind: 0.0,
    summary: "",
    icon: ""
};
// Array of daily weather classes
const dailyWeatherClass = [{
    day: 0, // need to find date format and convert
    timeZone: 0, // need to find date format and convert
    humidity: 0.0, // %
    chanceOfRain: 0.0, //%
    wind: 0.0,
    summary: "",
    icon: "",
    lowTemp: "",
    highTemp: ""
}];

// Helper functiion for AJAX calls
function httpGet(requestURL, aCallback, errCallback) {

    https.get(requestURL, (result) => {
        let data = '';

        // A chunk of data has been recieved.
        result.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        result.on('end', () => {
            console.log(JSON.parse(data));
            aCallback(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
        errCallback(err);
    });
}

module.exports = {

    getWeatherDB: function (geoLocation, aCallback, errCallback) {
        const PAUL_DARKSKY_APIKEY = "889d321b7d461f9aa8d4a951f2e163b6";

        let currentWeather = {};
        let dailyWeather = [];

        const exclude = "?exclude=minutely,alerts,flags";
        const unit = "?units=si";
        const CORSFix = "https://cors-anywhere.herokuapp.com/";

        let url = `https://api.darksky.net/forecast/${PAUL_DARKSKY_APIKEY}/${geoLocation.lat},${geoLocation.lng}${exclude}${unit}`;

        httpGet(url, function (weatherData) {
            console.log(weatherData);

            currentWeather = {};
            currentWeather.day = weatherData.currently.time;
            currentWeather.timeZone = weatherData.timezone;
            currentWeather.currentTemp = weatherData.currently.temperature;
            currentWeather.feelsLike = weatherData.currently.apparentTemperature;
            currentWeather.humidity = weatherData.currently.humidity;
            currentWeather.chanceOfRain = weatherData.currently.precipProbability;
            currentWeather.wind = weatherData.currently.windSpeed;
            currentWeather.summary = weatherData.currently.summary;
            currentWeather.icon = weatherData.currently.icon;

            dailyWeather = [];
            dailyWeather.length = 0; // prevent leaks

            for (let i = 0; i < 7; i++) {
                let dayWeather = {};

                dayWeather.day = weatherData.daily.data[i].time;
                dayWeather.timeZone = weatherData.timezone;
                dayWeather.humidity = weatherData.daily.data[i].humidity;
                dayWeather.chanceOfRain = weatherData.daily.data[i].precipProbability;
                dayWeather.wind = weatherData.daily.data[i].windSpeed;
                dayWeather.summary = weatherData.daily.data[i].summary;
                dayWeather.icon = weatherData.daily.data[i].icon;
                dayWeather.lowTemp = weatherData.daily.data[i].temperatureLow;
                dayWeather.highTemp = weatherData.daily.data[i].temperatureHigh;

                dailyWeather.push(dayWeather);
            }
            aCallback(currentWeather, dailyWeather);

        }, errCallback);
    }
};