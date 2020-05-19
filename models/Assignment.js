const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignmentSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'course',
  },
  largeTopicId: {
    type: Schema.Types.ObjectId,
    ref: 'largeTopic',
  },
  smallTopicId: {
    type: Schema.Types.ObjectId,
    ref: 'smallTopic',
  },
  questionIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'question',
    },
  ],
  participantIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  time: {
    type: Number,
    required: true,
    default: 60,
  },
  passPercent: {
    type: Number,
    required: true,
    default: 100,
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: 'comment',
  },
  progressIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'progress',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('assignment', AssignmentSchema);
