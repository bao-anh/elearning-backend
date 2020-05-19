const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScaleSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('scale', ScaleSchema);
