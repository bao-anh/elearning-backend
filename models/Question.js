const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = Schema({
  content: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('question', QuestionSchema);
