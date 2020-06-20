const Toeic = require('../models/Toeic');

exports.getToeicById = async (termId) => {
  return await Toeic.findById(termId);
};

exports.getAllToeicWithPopulate = async () => {
  return await Toeic.find({})
    .populate({ path: 'userId', select: 'name' })
    .select('currentScore');
};

exports.getOneToeicByUserId = async (userId) => {
  return await Toeic.findOne({ userId });
};

exports.getOneToeicWithPopulate = async (userId) => {
  return await Toeic.findOne({ userId }).populate({
    path: 'partIds',
    populate: { path: 'progressIds', match: { userId } },
  });
};

exports.getAllToeicWithoutPopulateUserAnswer = async () => {
  return await Toeic.find({}).populate({
    path: 'participantIds',
    select: '-userAnswer',
    populate: {
      path: 'testId userId',
      select: 'name',
      populate: {
        path: 'questionIds',
        select: 'childrenIds',
      },
    },
  });
};
