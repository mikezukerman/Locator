var config = require('./config.js');
var MongoClient = require('mongodb').MongoClient;

var dbConnection;
var url = process.env.OPENSHIFT_MONGODB_DB_HOST || config.MONGO_DB_URL;
var collectionName = config.MONGO_DB_COLLECTION;

MongoClient.connect(url, function(err, db) {
  if (err == null) {
    console.log("Connected to server.");
    dbConnection = db;    
  }
    else {
        console.log("Failed to connect: " + err);
    }
});

module.exports.getPeople = function getPeople(callback) { 
    dbConnection.collection(collectionName).find().toArray(
        function(err, docs) { callback(docs); });
}

module.exports.findUserById = findUserById;

function findUserById(userId, callback) {
    dbConnection.collection(collectionName).findOne({ "UserID" : userId},    
                                function(err, doc) {
        console.log("Found user by id:" + doc);
        return callback(doc);} );    
}
//Update or insert user
module.exports.updateUser = function updateUser(user) {
    dbConnection.collection(collectionName).findOneAndReplace(
        {"UserID" : user.UserID},
        user,
        {upsert: true}
    );
}
  
module.exports.clearAll = function clearAll() {
   dbConnection.collection(collectionName).remove({});
}
         
