const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  roll: {
    type: Number,
    required: true,
    default: 0,
  },
  courseIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'course',
    },
  ],
  participantIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'participant',
    },
  ],
  setIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'set',
    },
  ],
  toeicId: {
    type: Schema.Types.ObjectId,
    ref: 'toeic',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', UserSchema);
