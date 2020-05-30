const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToeicSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  partIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'part',
    },
  ],
  participantIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'participant',
    },
  ],
  currentScore: {
    type: Number,
    default: 0,
  },
  minScore: {
    type: Number,
    default: 0,
  },
  targetScore: {
    type: Number,
    default: 990,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('toeic', ToeicSchema);
