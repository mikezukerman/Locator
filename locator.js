var express = require('express');
var placesMod = require('./locator-places-mod.js');
var peopleMod = require('./locator-people-mod.js');

var app = express();

app.get('/findPlaces', findPlaces);
app.get('/findPeople', findPeople);
app.get('/updateUserLocation', updateUserLocation);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var server = app.listen(server_port, server_ip_address, function () {
  console.log( "Server started on " + server_ip_address + ":" + server_port )
});

function findPlaces(req, res) {   
   this.response = res;
   console.log('Find Places called, URL: ' + req.baseUrl + '   ' + JSON.stringify(req.query));
   placesMod.findPlaces(req.query, onPlacesDataReceived);
}

function findPeople(req, res) {
   this.response = res;
   console.log('Find People called, URL: ' + req.baseUrl + '   ' + JSON.stringify(req.query));
   var peopleData = peopleMod.findPeople(req.query); 
   onPeopleDataReceived(JSON.stringify(peopleData));
}

function updateUserLocation(req, res) {
    
}


//TODO: Consolidate these methods:
function onPlacesDataReceived(err, placesData) {
     this.response.writeHead(200, { 'Content-Type': 'application/json' })
     this.response.end(placesData);
}

function onPeopleDataReceived(peopleData) {
     this.response.writeHead(200, { 'Content-Type': 'application/json' })
     this.response.end(peopleData);
}

