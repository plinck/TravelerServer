/* **********************************************************************************
 * Favorite Places - 
 * This module allows you to add, delete, modify and list favorite places for 
 * our places dashboard app.
 * These places are used to determine the location of where you want to get the
 * information.  The idea is you are travelling to one of these places
 * and you want to know the weather and things to do when you get there like
 * good places to eat, bands that are playing, hot spots etc.
 ********************************************************************************** */
"use strict";
/* jshint node: true */

const express = require('express');
//const bodyParser = require('body-parser');

const http = require("http");
const url = require("url");
const fs = require("fs");
const weatherDB = require("./weatherModule.js");
const favDB = require("./favoritesModel.js");
const googDB = require("./googleAPIModule.js");

let app = express();
app.use(express.json());

// This responds a POST request for the homepage
app.post('/', function (req, res) {
    // Use express body parse to get JSON Data passed in the post
    console.log(`Got a POST request ${req.body}`);
 
    res.send(req.body);
});

// This responds a DELETE request 
app.delete('/del_fav', function (req, res) {
    console.log("Got a DELETE request for /del_user");
    res.setHeader('Content-Type', 'application/json');
    res.send('Hello DELETE');
});

app.get('/weather', (req, res) => {
    console.log("Got a GET request for /weather");
    let lat = req.query.lat;
    let lng = req.query.lng;
    res.setHeader('Content-Type', 'application/json');
    
    weatherDB.getWeatherDB({    
        lat: lat,
        lng: lng
    }, (currentWeather, dailyWeather) => {
        let weatherResponse = {
            currentWeather: currentWeather,
            dailyWeather: dailyWeather
        };
        res.write(JSON.stringify(weatherResponse));
        res.end();
    }, (errCode) => {});
});

// This responds a GET request for favorites, favoritesByName etc etc
app.get('/favorites*', function (req, res) {
    console.log("Got a GET request for /favorites*");
    res.setHeader('Content-Type', 'application/json');
    favDB.favoritesGetByName((favsDB) => {
        let favoritePlaces = favsDB; // copy the array into the global var for this context

        googDB.getLatLongForPlace(favoritePlaces[0], (newDataForAddress) => {
            console.log(newDataForAddress);
            favoritePlaces[0].lat = newDataForAddress.lat;
            favoritePlaces[0].lng = newDataForAddress.lng;
            res.end(JSON.stringify(favoritePlaces));
        }, (errCode) => {
            console.log(errCode);
        });
    });
});

// Start of node/express module
const PORT = process.env.PORT || 3000;
let server = app.listen(PORT, () => {
    let host = server.address().hostname;
    let port = server.address().port;

    console.log(`Example app listening at http://${host}:${port}`);
});