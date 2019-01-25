"use strict";
/* jshint node: true */

// Read and set environment variables
require("dotenv").config();
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

/*
 * Google Places API to get lat long
 * ====================================================================================================
 */
module.exports = {

    getLatLongForPlace: function (favoritePlace, aCallback, errCallback) {
        const PAUL_GOOGLE_APIKEY = process.env.PAUL_GOOGLE_APIKEY;

        let address = `${favoritePlace.address}${favoritePlace.city}${favoritePlace.state}${favoritePlace.zipCode}`;

        address = address.split(" ").join("+"); // replace spaces with plus for query

        let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${PAUL_GOOGLE_APIKEY}`;

        httpGet(url, function (geoData) {
            console.log(geoData);
            console.log(geoData.results[0].formatted_address);
            console.log(geoData.results[0].geometry.location.lat);
            console.log(geoData.results[0].geometry.location.lng);

            let newDataForAddress = {};
            newDataForAddress.formatted_address = geoData.results[0].formatted_address;
            newDataForAddress.lat = geoData.results[0].geometry.location.lat;
            newDataForAddress.lng = geoData.results[0].geometry.location.lng;

            aCallback(newDataForAddress);

        }, errCallback);
    }
};