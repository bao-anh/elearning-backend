const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LargeTopicSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'course',
  },
  smallTopicIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'smallTopic',
    },
  ],
  isFree: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model('largeTopic', LargeTopicSchema);
