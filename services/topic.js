const Topic = require('../models/Topic');

exports.getAllTopic = async () => {
  return await Topic.find();
};

exports.getTopicById = async (lessonId) => {
  return await Topic.findById(lessonId);
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
    .populate({ path: 'assignmentIds', populate: { path: 'questionIds' } });
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
