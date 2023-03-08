import mongoose from 'mongoose';
import APP_CONFIG from '../../localSettings';

const { log, error } = console;

const { CONNECTION_STRING } = APP_CONFIG;
const CONNECTION_SETTINGS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

class MongoDatabase {
  public initConnection() {
    log(`Database connecting...`);
    mongoose
      .connect(CONNECTION_STRING, CONNECTION_SETTINGS)
      .then((data) => log(`Connected with database=${data.connection.name} host=${data.connection.host}`))
      .catch((err) => error(err));
  }
}

export default new MongoDatabase();
