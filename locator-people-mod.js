var https = require('https');

var people = [
    {UserID: 'Mike', Distance:155, Location: {Latitude: 41.12345, Longitude: -81.12345}},
    {UserID: 'Mary', Distance:156, Location: {Latitude: 41.12346, Longitude: -81.12346}},
    {UserID: 'Jim', Distance:157, Location: {Latitude: 41.12347, Longitude: -81.12347}},
    {UserID: 'Jane', Distance:158, Location: {Latitude: 41.12348, Longitude: -81.12348}}
];

module.exports.findPeople = function  findPeople(query) {      
    //Add logic to go through people and search for those within radius
    //...
    return people;
}

function buildGeoServiceUrl(query) {
    var url =  GEOURL_BASE + "&gsradius=" + query.radius + "&gscoord=" + query.lat + "|" + query.lng;
    return url;
}