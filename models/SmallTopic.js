const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SmallTopicSchema = Schema({
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
  isFree: {
    type: Boolean,
    default: false,
  },
  lessonIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'lesson',
    },
  ],
  assignmentIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'assignment',
    },
  ],
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

module.exports = mongoose.model('smallTopic', SmallTopicSchema);
