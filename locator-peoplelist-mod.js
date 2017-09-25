var fs = require('fs');
var _file = ('people.txt');

module.exports.getPeople = function getPeople() {
    try {
        return JSON.parse(fs.readFileSync(_file).toString());
    }
    catch(ex) {
        console.log("Error reading from file: " + ex);
        return [];
    }
}

module.exports.savePeople = function savePeople(people) {
    resetDistance(people); //distance is menaingless in this context
   fs.writeFileSync(_file, JSON.stringify(people));
}

function resetDistance(people) {
  for(i=0;i<people.length;i++) { people[i].Distance=0; }
}
