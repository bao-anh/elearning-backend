const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'category',
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
  topicIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'topic',
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
