"use strict";
var mongoose = require('mongoose');
var productShema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productImage: { type: String, required: true }
});
module.exports = mongoose.model('Product', productShema);
