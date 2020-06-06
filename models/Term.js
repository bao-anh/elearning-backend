const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TermSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  definition: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
  },
  imageName: {
    type: String,
  },
  rememberIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'remember',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('term', TermSchema);
