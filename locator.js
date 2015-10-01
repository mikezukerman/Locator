var https = require('https');
var express = require('express');
var app = express();

app.get('/findPlaces', findPlaces);
//app.get('/findMyNeighbors', findMyNeighbors);
//app.get('/updateUserLocation', updateUserLocation);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var server = app.listen(server_port, server_ip_address, function () {
  console.log( "Server started on " + server_ip_address + ":" + server_port )
});


///////// Move this to a module
var allGeoData = '';

function  findPlaces(mainRequest, mainResponse) {     
    console.log('Find Places called, URL: ' + mainRequest.baseUrl + '   ' + JSON.stringify(mainRequest.query));
    
    var geoServiceUrl = buildGeoServiceUrl(mainRequest.query);
    console.log("Calling " + geoServiceUrl);
    https.get(geoServiceUrl, function(geoResponse) { 
        geoResponse.on('data', function(data) {allGeoData += data;}); 
        geoResponse.on('end', function() { sendResponse(mainResponse); }); 
    }).on('error', function(e) { console.log("Got error: " + e.message);});
}

var GEOURL_BASE = 'https://en.wikipedia.org/w/api.php?action=query&list=geosearch&format=json&gsprop=type';
function buildGeoServiceUrl(query) {
    var url =  GEOURL_BASE + "&gsradius=" + query.radius + "&gscoord=" + query.lat + "|" + query.lng;
    return url;
}

 function sendResponse(mainResponse) {
     //console.log(allGeoData);
     mainResponse.writeHead(200, { 'Content-Type': 'application/json' })
     //console.log(allGeoData);
     
     //var results = (JSON.parse(allGeoData)).query.geosearch;
     //results.sort(function(p1, p2) { return parseFloat(p1.dist) - parseFloat(p2.dist); });
     //mainResponse.write(JSON.stringify(results));
     mainResponse.write(allGeoData);
     mainResponse.end();
 }

/////Move these to separate module
function findMyNeighbors(req, res) {
    
}

function updateUserLocation(req, res) {
    
}

