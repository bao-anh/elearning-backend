const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScaleSchema = Schema({
  listening: [
    {
      type: Number,
    },
  ],
  reading: [
    {
      type: Number,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('scale', ScaleSchema);
