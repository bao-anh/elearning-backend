const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SetSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  userIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  imageURL: {
    type: String,
  },
  visiable: {
    type: Number,
    default: 0,
  },
  editable: {
    type: Number,
    default: 0,
  },
  termIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'term',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('set', SetSchema);
