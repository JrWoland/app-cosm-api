"use strict";
var mongoose = require('mongoose');
var Client = require('../models/clientModel');
var accountScheema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    services: { type: [String], default: function () { return ['LASHES']; } },
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: Client, unique: true }]
}, { timestamps: true });
accountScheema.set('autoIndex', false);
module.exports = mongoose.model('Account', accountScheema);
