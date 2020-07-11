const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = Schema({
  message: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  likeIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  childrenIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comment',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('comment', CommentSchema);
