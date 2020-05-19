const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = Schema({
  name: {
    type: String,
    required: true,
  },
  childrenIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'category',
    },
  ],
  courseIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'course',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('category', Category);
