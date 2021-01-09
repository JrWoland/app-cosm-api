const mongoose = require('mongoose');
const APP_CONFIG = require('../../localSettings.js')

const CONNECTION_STRING = `mongodb+srv://${APP_CONFIG.MONGO_ATLAS_USER}:${APP_CONFIG.MONGO_ATLAS_PW}@node-rest-k9mgy.mongodb.net/${APP_CONFIG.MONGO_ATLAS_DATABASE}?retryWrites=true&w=majority`
// const CONNECTION_STRING = 'mongodb://127.0.0.1:27017/?compressors=zlib&readPreference=primary&gssapiServiceName=mongodb&appname=MongoDB%20Compass&ssl=false'

const CONNECTION_SETTINGS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

class MongoDatabase {
    initConnection() {
        mongoose.connect(CONNECTION_STRING, CONNECTION_SETTINGS)
            .then(() => console.log('Connected with database'))
            .catch(err => console.error(err))
        console.log('Database: ' + mongoose.connection.states[mongoose.connection._readyState])
    }
}

module.exports = new MongoDatabase()