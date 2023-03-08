import { ExpressServer } from './infra/server/server';
import MongoDatabase from './infra/db/mongo';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json');

const { log } = console;

const port = process.env.PORT || 3000;

const server = new ExpressServer().create(version);
MongoDatabase.initConnection();
server.listen(port, () => {
  log('Server running on port: http://localhost:' + port);
});
