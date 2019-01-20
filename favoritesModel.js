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

const firebase = require("firebase");

// User info hardcode - when auth added, use real user info
const userID = "team9";

// Firebase
const PAUL_FB_APIKEY = "AIzaSyC1rPD9yqt2-9mk-T2WEwmFAc4uzYYr1UI";

// Initialize Firebase
var config = {
    apiKey: PAUL_FB_APIKEY,
    authDomain: "weatherdashboard-47786.firebaseapp.com",
    databaseURL: "https://weatherdashboard-47786.firebaseio.com",
    projectId: "weatherdashboard-47786",
    storageBucket: "",
    messagingSenderId: "587470309487"
};
firebase.initializeApp(config);
// Create a variable to reference the database.
let database = firebase.database();

// Reference where all favorites  are stored in DB
let favoritesDBRef = database.ref(`/favorite_cities/${userID}`);
let favorites = []; // array of objects for all the favorite cities
// Template Object/Class for what a favorite place in tge array holds
let ItemFavoritePlace = {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    key: "", // database key for update, delete or getting new from DB
    lat: "", // from google API and stored
    lng: "", // from google API and stored
    editMode: false // helper mode to tell whether user is editing this item
};
// Template Object/Class for what a favorite place in DB holds (i.e. snapshot.val())
let DBFavoritePlace = {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    lat: "",
    lng: ""
};

/*
 * Model Functionlity - NO HTML Renderring belongs here - pure model
 * ====================================================================================================
 */
module.exports = {
    // Get specific item by key from firebase DB
    favoriteGet: function (key, aCallback) {
        favoritesDBRef.child(key).once('value', function (snap) {
            aCallback(snap.val());
        });
    },

    // Add to firebase DB
    favoriteAdd: function (favoritePlace) {
        // Add object to firebase to the database
        favoritesDBRef.push(favoritePlace);
    },

    // Update item firebase DB
    favoriteUpdate: function (key, favoritePlace) {
        // Add object to firebase to the database
        let favoriteDBRef = favoritesDBRef.child(key);

        favoriteDBRef.set(favoritePlace);
    },

    // Delete from firebase DB
    favoriteDelete: function (key) {
        // Delete object from firebase
        let favoriteDBRef = favoritesDBRef.child(key);
        favoriteDBRef.remove();
    },

    // Get all favortie places in any order  
    favoritesGet: function (aCallback) {

        favoritesDBRef.on("value", function (snap) {
            let favorites = [];
            favorites.length = 0;

            snap.forEach(child => {
                let favorite = child.val();
                favorite.key = child.key;

                favorites.push(favorite);
            });
            aCallback(favorites);
        });
    },

    // get list of favorites places ordered by name
    favoritesGetByName: function (aCallback) {

        favoritesDBRef.orderByChild("name").on("value", function (snap) {
            let favorites = [];
            favorites.length = 0;

            snap.forEach(child => {
                let favorite = child.val();
                favorite.key = child.key;
                favorite.editMode = false; // Tells whether this should be renderred in edit mode

                favorites.push(favorite);
            });
            aCallback(favorites);
        });
    }
};