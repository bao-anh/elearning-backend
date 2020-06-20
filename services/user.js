const User = require('../models/User');

exports.getUserById = async (userId) => {
  return await User.findById(userId);
};

exports.getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.getUserByEmailWithPopulate = async (email) => {
  return await User.findOne({ email })
    .populate({ path: 'courseIds', populate: { path: 'progressIds' } })
    .populate({
      path: 'participantIds',
      select: 'score testId assignmentId date',
    });
};

exports.getUserByIdWithPopulate = async (userId) => {
  return await User.findById(userId)
    .populate({ path: 'courseIds', populate: { path: 'progressIds' } })
    .populate({
      path: 'participantIds',
      select: 'score testId assignmentId date',
    })
    .select('-password');
};

exports.getUserByIdWithPopulateSet = async (userId) => {
  return await User.findById(userId)
    .populate({
      path: 'setIds',
      populate: [
        {
          path: 'termIds',
          populate: { path: 'rememberIds', match: { userId } },
        },
        { path: 'ownerId ', select: 'name' },
      ],
    })
    .select('setIds');
};

exports.getUserByIdWithPopulateCourse = async (userId) => {
  return await User.findById(userId)
    .populate({
      path: 'courseIds',
    })
    .populate({
      path: 'courseIds',
      populate: { path: 'progressIds', match: { userId } },
    });
};
