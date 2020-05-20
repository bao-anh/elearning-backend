const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'course',
    required: true,
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'lesson',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('document', DocumentSchema);
