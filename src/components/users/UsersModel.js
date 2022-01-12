const mongoose = require('mongoose');

const mailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const userShema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    match: mailRegex
  },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userShema);
