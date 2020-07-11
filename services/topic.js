const Topic = require('../models/Topic');

exports.getAllTopic = async () => {
  return await Topic.find();
};

exports.getTopicById = async (topicId) => {
  return await Topic.findById(topicId);
};

exports.getTopicByIdWithPopulateComment = async (topicId) => {
  return await Topic.findById(topicId)
    .populate({
      path: 'commentIds',
      populate: [
        {
          path: 'userId',
          select: 'name imageURL',
        },
        {
          path: 'childrenIds',
          populate: {
            path: 'userId',
            select: 'name imageURL',
          },
        },
      ],
    })
    .select('commentIds');
};

exports.getTopicByIdWithPopulate = async (topicId, userId) => {
  return await Topic.findById(topicId)
    .populate({
      path: 'progressIds',
      match: { userId },
    })
    .populate({
      path: 'lessonIds',
      populate: { path: 'progressIds', match: { userId } },
    })
    .populate({
      path: 'assignmentIds',
      populate: { path: 'progressIds', match: { userId } },
    })
    .populate({ path: 'assignmentIds', populate: { path: 'questionIds' } })
    .populate({
      path: 'commentIds',
      populate: [
        {
          path: 'userId',
          select: 'name imageURL',
        },
        {
          path: 'childrenIds',
          populate: {
            path: 'userId',
            select: 'name imageURL',
          },
        },
      ],
    });
};

exports.getTopicByIdWithPopulateProgress = async (topicId, userId) => {
  return await Topic.findById(topicId)
    .populate({
      path: 'progressIds',
      match: { userId },
    })
    .populate({
      path: 'assignmentIds',
      populate: {
        path: 'progressIds',
        match: { userId },
      },
    })
    .populate({
      path: 'lessonIds',
      populate: {
        path: 'progressIds',
        match: { userId },
      },
    });
};
