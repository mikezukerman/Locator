var DEGREES_IN_RADIAN = 180.0 / Math.PI;
var MERIDIAN_DISTANCE_IN_ONE_DEGREE = 111000.0; //approx 111km

//distance in meters
module.exports.computeDistance = function computeDistance(location1, location2) {
    var distX = computeRelativeDistanceX(location1, location2);
    var distY = computeRelativeDistanceY(location1, location2);
    var distance = MERIDIAN_DISTANCE_IN_ONE_DEGREE * Math.sqrt(distX * distX + distY * distY);
    return parseInt(distance);
}    

function computeRelativeDistanceY(loc1, loc2) {
    return loc1.Latitude - loc2.Latitude;
}

function computeRelativeDistanceX(loc1, loc2) {
    return (loc1.Longitude - loc2.Longitude) * Math.cos(Math.abs(loc2.Latitude / DEGREES_IN_RADIAN));
}