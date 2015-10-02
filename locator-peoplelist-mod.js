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
   fs.writeFileSync(_file, JSON.stringify(people));   
}