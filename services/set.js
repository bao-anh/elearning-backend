const Set = require('../models/Set');

exports.getSetById = async (setId) => {
  return await Set.findById(setId);
};

exports.getSetByIdWithPopulate = async (setId, userId) => {
  return await Set.findById(setId)
    .populate({
      path: 'ownerId',
      select: 'name',
    })
    .populate({
      path: 'termIds',
      populate: { path: 'rememberIds', match: { userId } },
    });
};
