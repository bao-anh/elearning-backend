const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  content: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('comment', CommentSchema);
