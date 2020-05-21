const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonSchema = Schema({
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
  assignmentIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'assignment',
    },
  ],
  documentIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'document',
    },
  ],
  isFree: {
    type: Boolean,
    default: false,
  },
  videoLink: {
    type: String,
    required: true,
  },
  orderIndex: {
    type: Number,
    default: -1,
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

module.exports = mongoose.model('lesson', LessonSchema);
