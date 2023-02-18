const mongoose = require('mongoose');
const APP_CONFIG = require('../../localSettings');

const { CONNECTION_STRING } = APP_CONFIG.default;
const CONNECTION_SETTINGS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

class MongoDatabase {
  initConnection() {
    mongoose
      .connect(CONNECTION_STRING, CONNECTION_SETTINGS)
      .then((data) => console.log(`Connected with database=${data.connection.name} host=${data.connection.host}`))
      .catch((err) => console.error(err));
    console.log('Database: ' + mongoose.connection.states[mongoose.connection._readyState]);
  }
}

module.exports = new MongoDatabase();
