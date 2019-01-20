/* **********************************************************************************
 * Favorite Places - 
 * This module allows you to add, delete, modify and list favorite places for 
 * our places dashboard app.
 * These places are used to determine the location of where you want to get the
 * information.  The idea is you are travelling to one of these places
 * and you want to know the weather and things to do when you get there like
 * good places to eat, bands that are playing, hot spots etc.
 ********************************************************************************** */

// Use strict to keep things sane and not crap code
"use strict";

const http = require("http");
const url = require("url");
const fs = require("fs");
const weatherDB = require("./weatherModule.js");
const favDB = require("./favoritesModel.js");
const googDB = require("./googleAPIModule.js");

const hostname = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/JSON");

    let path = url.parse(req.url).pathname;
    switch (path) {
        case "/":
            console.log(path);
            break;
        case "/weather":
            console.log(path);
            weatherDB.getWeatherDB({
                lat: 33,
                lng: -84
            }, (currentWeather, dailyWeather) => {
                console.log(currentWeather);
                console.log(dailyWeather);
                res.write(JSON.stringify(currentWeather));
                res.write(JSON.stringify(dailyWeather));
                res.end();
            }, (errCode) => {});
            break;
        case "/locationsByName":
            console.log(path);
            favDB.favoritesGetByName((favsDB) => {
                let favoritePlaces = favsDB; // copy the array into the global var for this context

                googDB.getLatLongForPlace(favoritePlaces[0], (newDataForAddress) => {
                    console.log(newDataForAddress);
                    favoritePlaces[0].lat = newDataForAddress.lat;
                    favoritePlaces[0].lng = newDataForAddress.lng;
                    res.write(JSON.stringify(favoritePlaces));
                    res.end();
                }, (errCode) => {
                    console.log(errCode);
                });
            });
            break;
    }
});

server.listen(port, hostname, () => {
    console.log(`Server Running ${port}`);
});