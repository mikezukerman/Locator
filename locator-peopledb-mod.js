var config = require('./config.js');
var MongoClient = require('mongodb').MongoClient;

var dbConnection;
//var connString = 'mongodb://' + (process.env.OPENSHIFT_MONGODB_DB_HOST || config.MONGO_DB_URL);

// default to a 'localhost' configuration:
var connectionSring = 'mongodb://127.0.0.1:27017/locator';

// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connectionSring = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}
var collectionName = config.MONGO_DB_COLLECTION;

MongoClient.connect(connectionSring, function(err, db) {
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
         
