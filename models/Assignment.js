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
  topicId: {
    type: Schema.Types.ObjectId,
    ref: 'topic',
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'lesson',
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
      ref: 'participant',
    },
  ],
  isFree: {
    type: Boolean,
    default: false,
  },
  timeToShowUp: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    required: true,
    default: 60,
  },
  orderIndex: {
    type: Number,
    default: -1,
  },
  passPercent: {
    type: Number,
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
