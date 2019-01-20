 //Zomato API 
 "use strict";
 /* jshint node: true */

 const https = require('https');

 //1st API call to zomato api - this returns city data that we need to use to call in the 
 //darksky api (lat/long).  This also returns data we need in our second api call to zomato
 // that gives us the restaurant info (we need cityID and entityType in our second call to zomato api)
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

 function locationInfoCall(lat, long, callback) {
     let apiKey = "0873254cb6494b6d3d3851a49e152e4c"
     let cityId = "";
     let cityStateName = "";
     let entityType = "";
     let entityId = "";

     let queryURL1 = `https://developers.zomato.com/api/v2.1/locations?lat=${lat}&lon=${long}&apikey=${apiKey}`;
     httpGet(queryURL1, (zomatoResponse) => {

         cityId = zomatoResponse.location_suggestions[0].city_id;
         cityStateName = zomatoResponse.location_suggestions[0].title;
         entityType = zomatoResponse.location_suggestions[0].entity_type;
         entityId = zomatoResponse.location_suggestions[0].entity_id;

         var parameters = {
             apiKey: apiKey,
             cityId: cityId,
             cityStateName: cityStateName,
             entityType: entityType,
             entityId: entityId
         };
         callback(parameters);
     });

 } //end locationInfoCall function

 // return lat long from city
 function foodInfoCall(params) {
     var queryURL2 = "https://developers.zomato.com/api/v2.1/location_details?entity_id=" + params.entityID + "&entity_type=" + params.entityType + "&apikey=" + params.apiKey;
     httpGet(queryURL2, (zomatoResponse2) => {
         $("#places-table").empty();
         for (let i = 0; i < 5; i++) {
             var name = zomatoResponse2.best_rated_restaurant[i].restaurant.name;
             var type = zomatoResponse2.best_rated_restaurant[i].restaurant.cuisines;
             var price = zomatoResponse2.best_rated_restaurant[i].restaurant.price_range;
             var rating = zomatoResponse2.best_rated_restaurant[i].restaurant.user_rating.aggregate_rating;
             var address = zomatoResponse2.best_rated_restaurant[i].restaurant.location.address;
             var restaurantTable = $("<tr>").append(
                 $("<th>").text(name),
                 $("<th>").text(type),
                 $("<th>").text(price),
                 $("<th>").text(rating),
                 $("<th>").text(address),
             );
             $("#places-table").append(restaurantTable);
             console.log(address);
         } //closing for loop
     });
 } //end foodInfoCall function

 // call from controller to invoke search
 module.exports = {
     getPlaceInfo: function (placeObject) {
         locationInfoCall(placeObject.lat, placeObject.lng, foodInfoCall);
     }
 }