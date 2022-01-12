"use strict";
var mongoose = require('mongoose');
var visitScheema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    done: { type: Boolean, default: function () { return false; } },
    services: [{ type: mongoose.Schema.Types.Mixed }],
}, { timestamps: true });
module.exports = mongoose.model('Visit', visitScheema);
