import { ExpressServer } from './infra/server/server';
import MongoDatabase from './infra/db/mongo';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json');

const port = process.env.PORT || 3000;

const server = new ExpressServer().create(version);
MongoDatabase.initConnection();
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Server running on port: http://localhost:' + port);
});
