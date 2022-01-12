"use strict";
var mongoose = require("mongoose");
var BeautyServicesTypes = {
    LASHES: 'LASHES',
    NAILS: 'NAILS'
};
var mailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
var beautyServiceScheema = new mongoose.Schema({
    name: {
        type: String,
        default: BeautyServicesTypes.LASHES,
        enum: {
            values: [BeautyServicesTypes.LASHES, BeautyServicesTypes.NAILS],
            message: "{VALUE} is not supported",
        },
    },
    expires: {
        type: Date,
        default: function () {
            if (this.name === BeautyServicesTypes.LASHES) {
                return new Date(2100, 1, 1);
            }
            else {
                return Date.now();
            }
        },
    },
}, { timestamps: true });
mongoose.model("BeautyService", beautyServiceScheema);
var accountScheema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        match: mailRegex,
        validate: function () { },
    },
    password: { type: String, required: true },
    services: {
        type: [beautyServiceScheema],
        default: function () { return ({ name: "LASHES" }); },
    },
    payments: { type: [Object] },
}, { timestamps: true });
accountScheema.set("autoIndex", false);
module.exports = mongoose.model("Account", accountScheema);
