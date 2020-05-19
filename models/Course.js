const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  realPrice: {
    type: Number,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    required: true,
  },
  memberIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  largeTopicIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'largeTopic',
    },
  ],
  documentIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'document',
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

module.exports = mongoose.model('course', CourseSchema);
