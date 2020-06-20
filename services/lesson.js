const Lesson = require('../models/Lesson');

exports.getAllLesson = async () => {
  return await Lesson.find();
};

exports.getLessonById = async (lessonId) => {
  return await Lesson.findById(lessonId);
};

exports.getLessonByIdWithPopulateProgress = async (lessonId, userId) => {
  return await Lesson.findById(lessonId)
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
    });
};

exports.getLessonByIdWithPopulate = async (lessonId, userId) => {
  return await Lesson.findById(lessonId)
    .populate({
      path: ' progressIds',
      match: { userId },
    })
    .populate({
      path: 'assignmentIds',
      populate: { path: 'questionIds', populate: { path: 'childrenIds' } },
    })
    .populate({
      path: 'assignmentIds',
      populate: { path: 'progressIds', match: { userId } },
    })
    .populate({ path: 'documentIds' });
};
