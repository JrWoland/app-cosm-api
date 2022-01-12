const http = require('http');
const { ExpressServer } = require('./infra/server/server');
const MongoDatabase = require('./infra/db/mongo')
const { version } = require('../package.json')

const port = process.env.PORT || 3000;

const server = new ExpressServer().create(version)
MongoDatabase.initConnection()
server.listen(port, () => {
  console.log('Server running on port: http://localhost:' + port);
});
