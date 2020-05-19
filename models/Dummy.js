const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DummySchema = Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('dummy', DummySchema);
