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
  largeTopcId: {
    type: Schema.Types.ObjectId,
    ref: 'largeTopic',
  },
  smallTopicId: {
    type: Schema.Types.ObjectId,
    ref: 'smallTopic',
  },
  assignmentIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'assigment',
    },
  ],
  documentIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'document',
    },
  ],
  videoLink: {
    type: String,
    required: true,
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
