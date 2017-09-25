//var dateFormat = require('dateformat');
var geometry = require('./locator-geometry-mod.js');
var peopleList = require('./locator-peoplelist-mod.js');
var people = peopleList.getPeople();

var MAX_USER_IDLE_TIME_MS = 1800*1000; //A user idle for too long will be ignored

module.exports.showAllPeople = function showAllPeople() {
    return people;
}

module.exports.clearPeople = function clearPeople() {
    people = [];
    peopleList.savePeople(people);
    return [];
}

module.exports.findPeople = function  findPeople(query) {
    var srcUser = findUserById(query.user);
    if (srcUser) {
        var radius = parseInt(query.radius);
        return people.filter(findNeighbors(srcUser, radius));
    }
    else {
        return [];
    }
}

module.exports.updateUserLocation = function updateUserLocation(query) {
    var userId = query.user;
    var user = findUserById(userId);
    var latitude = parseFloat(query.lat);
    var longitude = parseFloat(query.lng);
    var ts = getTimeStamp();
    if (!user) {
        console.log("User '" + userId + "' not found, creating new");
        user = {UserID: userId, Location: {Latitude: latitude, Longitude: longitude}, Distance:0, LastSeen: ts};
        people.push(user);
        console.log("Added new user " + JSON.stringify(user));
    }
    else {
        console.log("User '" + userId + "' found, updating");
        user.Location.Latitude = latitude;
        user.Location.Longitude = longitude;
        user.Distance = 0;
        user.LastSeen = ts;
    }
    peopleList.savePeople(people);

    return people; //user;
}

function findUserById(userId) {
  for(i=0; i<people.length; i++) {
    if (userId === people[i].UserID) {
        return people[i];
    }
  }
  return null;
}

function findNeighbors(srcUser, radius) {
    return function(person) {
        if (person.UserID === srcUser.UserID) { //we look for users other than the one passed in
            return false;
        }
        else if(idleTooLong(person)) {
            return false;
        }
        else {
            var distance = geometry.computeDistance(srcUser.Location, person.Location);
            if (distance <= radius) {
                person.Distance = distance; //this side effect is a bit lame; revisit later.
                return true;
            }
        }
        return false;
    }
}

function idleTooLong(person) {
  if (person.LastSeen === '') { return false; }
  var lastSeen = new Date(person.LastSeen);
  var now = new Date();
  var idleTime = (now.getTime() - lastSeen.getTime()); //time interval in ms

    console.log(person.UserID + " last seen " + lastSeen + ", current time: " + now + ", idleTime " + idleTime);
  return (idleTime >= MAX_USER_IDLE_TIME_MS);
}

function getTimeStamp() {
  var d = new Date();
  return d.toString(); //dateFormat(d, "yyyy-mm-dd HH:MM:ss");
}
