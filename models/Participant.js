const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParticipantSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: 'assignment',
  },
  testId: {
    type: Schema.Types.ObjectId,
    ref: 'test',
  },
  userAnswer: [
    {
      type: String,
    },
  ],
  score: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('participant', ParticipantSchema);
