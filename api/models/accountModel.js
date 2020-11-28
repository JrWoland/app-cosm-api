const mongoose = require('mongoose')

const accountScheema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    services: [{ type: String }],
})

module.exports = mongoose.model('Account', accountScheema);