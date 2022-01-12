"use strict";
var mongoose = require('mongoose');
var APP_CONFIG = require('../../localSettings.js');
var CONNECTION_STRING = APP_CONFIG.CONNECTION_STRING, MONGO_ATLAS_DATABASE = APP_CONFIG.MONGO_ATLAS_DATABASE;
var CONNECTION_SETTINGS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
var MongoDatabase = /** @class */ (function () {
    function MongoDatabase() {
    }
    MongoDatabase.prototype.initConnection = function () {
        mongoose.connect(CONNECTION_STRING, CONNECTION_SETTINGS)
            .then(function (data) { return console.log('Connected with database: ' + data.connection.name); })
            .catch(function (err) { return console.error(err); });
        console.log('Database: ' + mongoose.connection.states[mongoose.connection._readyState]);
    };
    return MongoDatabase;
}());
module.exports = new MongoDatabase();
