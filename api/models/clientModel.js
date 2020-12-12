const mongoose = require('mongoose')

const clientScheema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    surname: { type: String },
    phone: { type: String },
    age: { type: Number, min: 1, max: 85 },
    visits: { type: [mongoose.Schema.Types.Mixed], unique: true }

})

module.exports = mongoose.model('Client', clientScheema);