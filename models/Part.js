const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PartSchema = Schema({
  partNumber: {
    type: Number,
    required: true,
  },
  progressIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'progress',
    },
  ],
  participantIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'participant',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('part', PartSchema);
