var config = require('./config.js');
var geometry = require('./locator-geometry-mod.js');
var peopleDB = require('./locator-peopledb-mod.js');

module.exports.showAllPeople = function showAllPeople(callback) {
    peopleDB.getPeople(callback);
}

module.exports.clearAllPeople = function clearAllPeople() {
    peopleDB.clearAllPeople();
    return [];
}

module.exports.findPeople = function  findPeople(query, callback) {
    peopleDB.findUserById(query.user.toLowerCase(), function(user) {
          findNeighbors(user, parseInt(query.radius), callback);
    });
}


function findNeighbors(srcUser, radius, callback) {
    console.log("Src user: " + srcUser.userID);
     //TODO: do this in the DB module
    peopleDB.getPeople(function(people) {
      var filteredPeople = people.filter(isGoodNeighbor(srcUser, radius));
            return callback(filteredPeople);
    });
}

module.exports.updateUserLocation = function updateUserLocation(query) {
    var user = { UserID: query.user.toLowerCase(),
                 Location: {Latitude: parseFloat(query.lat), Longitude: parseFloat(query.lng)},
                 Distance: 0,
                 LastSeen: getTimeStamp()};
    peopleDB.updateUser(user);
    return user;
}

function isGoodNeighbor(srcUser, radius) {
    return function(person) {
        console.log("Inside FindNeighbors, person: " + JSON.stringify(person));

        if (person.UserID === srcUser.UserID) { //we look for users other than the one passed in
            return false;
        }
        else if(idleTooLong(person)) {
            console.log(person.UserID + " idle too long");
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
  var idleTimeMs = (now.getTime() - lastSeen.getTime());
  return (idleTimeMs >= config.MAX_USER_IDLE_TIME_MS);
}

function getTimeStamp() {
  var d = new Date();
  return d.toString();
}
