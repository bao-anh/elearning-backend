const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'course',
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
  isFree: {
    type: Boolean,
    default: false,
  },
  commentIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comment',
    },
  ],
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

module.exports = mongoose.model('topic', TopicSchema);
