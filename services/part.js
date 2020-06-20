const Part = require('../models/Part');

exports.getAllPart = async () => {
  return await Part.find({}).select('_id');
};

exports.getAllPartByUserId = async (userId) => {
  return await Part.find({}).populate({
    path: 'progressIds',
    match: { userId },
  });
};

exports.getAllPartByUserIdWithPopulate = async (userId) => {
  return await Part.find({})
    .populate({ path: 'progressIds', match: { userId } })
    .populate({
      path: 'participantIds',
      match: { userId },
      populate: { path: 'testId' },
    });
};

exports.getOnePartByPartNumber = async (partNumber) => {
  return await Part.findOne({ partNumber });
};

exports.getOnePartByPartNumberWithPopulateProgress = async (partNumber) => {
  return await Part.findOne({
    partNumber,
  }).populate({
    path: 'progressIds',
    populate: { path: 'userId', select: 'name' },
  });
};

exports.getOnePartByPartNumberWithPopulateTest = async (partNumber) => {
  return await Part.findOne({
    partNumber,
  }).populate({
    path: 'participantIds',
    populate: {
      path: 'testId userId',
      populate: {
        path: 'questionIds',
        populate: { path: 'childrenIds' },
      },
    },
  });
};

exports.getOnePartByUserIdWithPopulate = async (partNumber, userId) => {
  return await Part.findOne({
    partNumber,
  })
    .populate({ path: 'progressIds', match: { userId } })
    .populate({
      path: 'participantIds',
      match: { userId },
      populate: { path: 'testId' },
    });
};
