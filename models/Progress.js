const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgressSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  percentComplete: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('progress', ProgressSchema);
