const mongoose = require('mongoose')

const lashesScheema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    done: { type: Boolean, default: () => false },
    date: { type: Date, default: () => Date.now() },
    time: { type: String, default: () => '' },
    type: { type: String, default: () => '' },
    glue: { type: String, default: () => '' },
    remover: { type: String, default: () => '' },
    purpose: { type: String, default: () => '' },
    curve: [{ type: String }],
    width: [{ type: Number }],
    length: [{ type: Number }],
    price: { type: Number, default: () => 0 },
    notes: { type: String, default: () => '' }
})

module.exports = mongoose.model('Lashes', lashesScheema);