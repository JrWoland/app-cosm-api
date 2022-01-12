"use strict";
var http = require('http');
var ExpressServer = require('./server').ExpressServer;
var MongoDatabase = require('./infra/db/mongo');
var version = require('../package.json').version;
var port = process.env.PORT || 3000;
var server = new ExpressServer().create(version);
MongoDatabase.initConnection();
server.listen(port, function () {
    console.log('Server running on port: http://localhost:' + port);
});
