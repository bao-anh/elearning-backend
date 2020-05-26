const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = Schema({
  content: {
    type: String,
  },
  part: {
    type: Number,
    default: 0,
  },
  soundLink: {
    type: String,
  },
  imageLink: {
    type: String,
  },
  script: {
    type: String,
  },
  childrenIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'question',
    },
  ],
  answerArray: [
    {
      type: String,
    },
  ],
  correctAnswer: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('question', QuestionSchema);
