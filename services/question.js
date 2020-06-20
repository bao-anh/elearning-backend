const Question = require('../models/Question');

exports.getAllQuestion = async () => {
  return await Question.find();
};

exports.getQuestionById = async (lessonId) => {
  return await Question.findById(lessonId);
};

exports.getQuestionByPartNumberWithPopulateChildren = async (partNumber) => {
  return await Question.find({
    part: partNumber,
  }).populate({ path: 'childrenIds' });
};

exports.getQuestionByPartNumberSelectId = async (partNumber) => {
  return await Question.find({ part: partNumber }).select('_id');
};
