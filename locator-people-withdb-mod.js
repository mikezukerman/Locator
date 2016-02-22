var config = require('./config.js');
var geometry = require('./locator-geometry-mod.js');
var peopleDB = require('./locator-peopledb-mod.js');

var MAX_USER_IDLE_TIME_MS = 1800*1000; //A user idle for too long will be ignored

module.exports.showAllPeople = function showAllPeople(callback) { 
    peopleDB.getPeople(callback);
}

module.exports.clearPeople = function clearPeople() { 
    peopleDB.clearAll();
    return [];
}

module.exports.findPeople = function  findPeople(query, callback) { 
    peopleDB.findUserById(query.user, function(user) {
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
    var user = { UserID: query.user, 
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
            console.log(person.UserID + " " + distance + " m from " + srcUser.UserID);
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
  return (idleTime >= config.MAX_USER_IDLE_TIME_MS);
}

function getTimeStamp() {
  var d = new Date();
  return d.toString(); //dateFormat(d, "yyyy-mm-dd HH:MM:ss");
}