const mongoose = require('mongoose');
const APP_CONFIG = require('../../localSettings.js')

const { CONNECTION_STRING, MONGO_ATLAS_DATABASE } = APP_CONFIG
const CONNECTION_SETTINGS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

class MongoDatabase {
    initConnection() {
        mongoose.connect(CONNECTION_STRING, CONNECTION_SETTINGS)
            .then(() => console.log('Connected with database: ' + MONGO_ATLAS_DATABASE))
            .catch(err => console.error(err))
        console.log('Database: ' + mongoose.connection.states[mongoose.connection._readyState])
    }
}

module.exports = new MongoDatabase()