const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  part: {
    type: String,
    default: 'all',
  },
  questionIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'question',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('dummy', TestSchema);
