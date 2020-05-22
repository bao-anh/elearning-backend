const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = Schema({
  content: {
    type: String,
    required: true,
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
  correctAnswer: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('question', QuestionSchema);
