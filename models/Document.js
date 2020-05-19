const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('document', DocumentSchema);
