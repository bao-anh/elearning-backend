const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RememberSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  correct: {
    type: Number,
    default: 0,
  },
  attempt: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('remember', RememberSchema);
