const mongoose = require('mongoose');

const CONNECTION_STRING = `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@node-rest-k9mgy.mongodb.net/${process.env.MONGO_ATLAS_DATABASE}?retryWrites=true&w=majority`
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
        console.log(mongoose.connection.states[mongoose.connection._readyState])
    }
}

module.exports = new MongoDatabase()