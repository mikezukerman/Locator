var https = require('https');
var GEOURL_BASE = 'https://en.wikipedia.org/w/api.php?action=query&list=geosearch&format=json&gsprop=type';
var allGeoData;

var calls = 0;

module.exports.findPlaces = function  findPlaces(query, callback) {      
    var geoServiceUrl = buildGeoServiceUrl(query);
    console.log("Calling " + geoServiceUrl);
    allGeoData = '';
    
    calls++;
    console.log("Places called " + calls + " times");
    
    https.get(geoServiceUrl, function(geoResponse) { 
        geoResponse.on('data', function(data) {allGeoData += data;}); 
        geoResponse.on('end', function() {return callback(null, allGeoData);} ); 
    }).on('error', function(e) { console.log("Got error: " + e.message);});
}

function buildGeoServiceUrl(query) {
    var url =  GEOURL_BASE + "&gsradius=" + query.radius + "&gscoord=" + query.lat + "|" + query.lng;
    return url;
}