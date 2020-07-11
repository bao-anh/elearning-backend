const Course = require('../models/Course');

exports.getAllCourseWithPopulate = async (userId) => {
  return await Course.find().populate({
    path: 'progressIds',
    match: { userId },
  });
};

exports.getAllCourseWithPopulateProgress = async (userId) => {
  return await Course.find().populate({ path: 'categoryIds' }).populate({
    path: 'progressIds',
    match: { userId },
  });
};

exports.getCourseById = async (courseId) => {
  return await Course.findById(courseId);
};

exports.getCourseByIdWithPopulateComment = async (courseId) => {
  return await Course.findById(courseId)
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

exports.getCourseByIdWithPopulateProgress = async (courseId, userId) => {
  return await Course.findById(courseId)
    .populate({
      path: 'progressIds',
      match: { userId },
    })
    .populate({
      path: 'topicIds',
      populate: {
        path: 'progressIds',
        match: { userId },
      },
    });
};

exports.getCourseByIdWithPopulate = async (courseId, userId) => {
  return await Course.findById(courseId)
    .populate({
      path: 'memberIds',
    })
    .populate({
      path: 'documentIds',
    })
    .populate({
      path: 'progressIds',
      populate: { path: 'userId' },
    })
    .populate({
      path: 'topicIds',
      populate: { path: 'progressIds', match: { userId } },
    })
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
