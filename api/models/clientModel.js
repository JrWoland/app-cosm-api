const mongoose = require('mongoose');

const clientScheema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  surname: { type: String },
  phone: { type: String },
  age: { type: Number, min: 0, max: 85 },
  visits: { type: [mongoose.Schema.Types.Mixed], sparse: true },
});

module.exports = mongoose.model('Client', clientScheema);
