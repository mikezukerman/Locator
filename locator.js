var express = require('express');
var placesMod = require('./locator-places-mod.js');
var peopleMod = require('./locator-people-withdb-mod.js');

var app = express();

app.get('/findPlaces', findPlaces);
app.get('/findPeople', findPeople);
app.get('/updateUserLocation', updateUserLocation);
app.get('/showAllPeople', showAllPeople);
app.get('/clearAllPeople', clearAllPeople);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var server = app.listen(server_port, server_ip_address, function () {
  console.log( "Server started on " + server_ip_address + ":" + server_port )
});

function findPlaces(req, res) {
   console.log('Find Places called, URL: ' + req.baseUrl + '   ' + JSON.stringify(req.query));
   placesMod.findPlaces(req.query, function(err, placesData) {res.end(placesData);} );
}

function findPeople(req, res) {
   console.log('Find People called, URL: ' + req.baseUrl + '   ' + JSON.stringify(req.query));
   peopleMod.findPeople(req.query, function(people) { res.json(people); });
}

function updateUserLocation(req, res) {
    console.log('Update user location called, query = ' + JSON.stringify(req.query));
    res.json(peopleMod.updateUserLocation(req.query));
}

function showAllPeople(req, res) {
    peopleMod.showAllPeople(function(people) { res.json(people); });
}

function clearAllPeople(req, res) {
    res.json(peopleMod.clearAllPeople());
}
