const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  projectId: { type: String, required: true },
  brokerId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);
