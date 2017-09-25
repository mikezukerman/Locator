var https = require('https');
var config = require('./config.js');

var allGeoData;
var calls = 0;

module.exports.findPlaces = function  findPlaces(query, callback) {
    var placesServiceUrl = buildPlacesServiceUrl(query);
    console.log("Calling " + placesServiceUrl);
    allGeoData = '';

    https.get(placesServiceUrl, function(geoResponse) {
        geoResponse.on('data', function(data) {allGeoData += data;});
        geoResponse.on('end', function() {return callback(null, allGeoData);} );
    }).on('error', function(e) { console.log("Got error: " + e.message);});
}

function buildPlacesServiceUrl(query) {
    var url =  config.PLACES_SERVICE_URL + "&gsradius=" + query.radius + "&gscoord=" + query.lat + "|" + query.lng;
    return url;
}
