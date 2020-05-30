const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  questionIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'question',
    },
  ],
  duration: {
    type: Number,
    default: 600,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('test', TestSchema);
