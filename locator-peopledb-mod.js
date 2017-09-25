var config = require('./config.js');
var MongoClient = require('mongodb').MongoClient;

var dbConnection;
openConnection();

var collectionName = config.MONGO_DB_COLLECTION;

module.exports.getPeople = function getPeople(callback) {
    dbConnection.collection(collectionName).find().toArray(
        function(err, docs) { callback(docs); });
}

module.exports.findUserById = findUserById;

function findUserById(userId, callback) {
    dbConnection.collection(collectionName).findOne(
            { "UserID" : userId},
            function(err, doc) {
                console.log("Found user by id:" + doc);
                return callback(doc); }
            );
}
//Update or insert user
module.exports.updateUser = function updateUser(user) {
    dbConnection.collection(collectionName).findOneAndReplace(
        {"UserID" : user.UserID},
        user,
        {upsert: true}
    );
}

module.exports.clearAllPeople = function clearAllPeople() {
   dbConnection.collection(collectionName).remove({});
}

function openConnection() {
    MongoClient.connect(getDbConnectionString(), function(err, db) {
      if (err == null) {
        console.log("Connected to server.");
        dbConnection = db;
      }
        else {
            console.log("Failed to connect: " + err);
        }
    });
}

function getDbConnectionString() {
    var connectionString = 'mongodb://';

    //Use OPENSHIFT env variables if present, otherwise use config file:
    if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
      connectionString +=
        process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
    }
    else {
        connectionString += config.MONGO_DB_URL;
    }
    return connectionString;
}
